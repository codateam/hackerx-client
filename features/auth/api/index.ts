import api from "@/configs/api-config";
import { cookiesStorage } from "@/lib/storage";
import { setUser } from "@/store/auth/auth.slice";
import { store } from "@/store/store";
import { ResponseType } from "@/types/auth";

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
  data: z.infer<typeof AddAdminValidationSchema>
): Promise<ResponseType<any>> => {
  try {
    const endpoint =
      data.role === "admin" ? apiRoutes.ADD_ADMIN : apiRoutes.ADD_LECTURER;

    const response = await api.post(endpoint, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });

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
