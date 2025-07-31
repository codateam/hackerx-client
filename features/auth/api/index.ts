import api from "@/configs/api-config";
import { cookiesStorage } from "@/lib/storage";
import { setUser } from "@/store/auth/auth.slice";
import { store } from "@/store/store";
import { OrganizationsResponse, ResponseType } from "@/types/auth";

import {
  AddAdminValidationSchema,
  LoginValidationSchema,
  SignupValidationSchema,
} from "../lib/validation";
import { apiRoutes } from "../utils/auth";
import { isAxiosError } from "axios";
import { z } from "zod";

export const handleSignup = async (
  data: z.infer<typeof SignupValidationSchema>
): Promise<ResponseType<any>> => {
  try {
    const { firstName, lastName, matricNo, email, password } = data;

    const response = await api.post(apiRoutes.SIGNUP, {
      email,
      firstName,
      lastName,
      matricNo,
      password,
    });

    store.dispatch(setUser(response.data.data));

    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    let message;

    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }

    return {
      success: false,
      data: error,
      message: message,
    };
  }
};

export const handleOrgSignup = async (data: {
  organization: {
    name: string;
    code: string;
    type: "university" | "school" | "college" | "institute" | "academy";
    description?: string;
  };
  mainAdmin: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}): Promise<ResponseType<any>> => {
  try {
    const response = await api.post(apiRoutes.ORG_SIGNUP, data);

    // You can dispatch mainAdmin as the user if needed
    store.dispatch(setUser(response.data.data));

    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    let message;

    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }

    return {
      success: false,
      data: error,
      message,
    };
  }
};

export const handleLogin = async (
  data: z.infer<typeof LoginValidationSchema>
): Promise<ResponseType<any>> => {
  try {
    const response = await api.post(`${apiRoutes.SIGNIN}`, data);

    store.dispatch(
      setUser({
        user: response.data.data.user,
        isAuth: true,
      })
    );

    cookiesStorage.setItem("token", response.data.data.token);

    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    let message;

    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }

    return {
      success: false,
      data: error,
      message: message,
    };
  }
};

export const handleAddUser = async (
  data: z.infer<typeof AddAdminValidationSchema>,
  isOrganizationAdmin: boolean = false
): Promise<ResponseType<any>> => {
  try {
    let endpoint: string;

    if (data.role === "admin") {
      // Use organization admin endpoint if called by org admin
      endpoint = isOrganizationAdmin
        ? apiRoutes.ADD_ORG_ADMIN
        : apiRoutes.ADD_ADMIN;
    } else {
      // For lecturers, use the regular lecturer endpoint
      endpoint = apiRoutes.ADD_LECTURER;
    }

    const requestData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };

    // Add organizationId if it exists in the data
    if (data.organizationId) {
      requestData.organizationId = data.organizationId;
    }

    const response = await api.post(endpoint, requestData);

    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    let message;

    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }

    return {
      success: false,
      data: error,
      message: message ?? `An error occurred while adding ${data.role}.`,
    };
  }
};

export const fetchOrganizations = async (): Promise<
  ResponseType<OrganizationsResponse>
> => {
  try {
    const response = await api.get(apiRoutes.GET_ALL_ORGANIZATIONS);

    return {
      success: true,
      data: response.data.data, // expects { count, organizations }
      message: response.data.message,
    };
  } catch (error) {
    let message;

    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }

    return {
      success: false,
      data: { count: 0, organizations: [] },
      message: message ?? "An error occurred while fetching organizations.",
    };
  }
};
