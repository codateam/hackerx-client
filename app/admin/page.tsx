"use client";
import { MetricCard } from "@/features/dashboard/components/MetricCard";
import { CourseItem } from "@/features/dashboard/components/CourseItem";
import { BarChart } from "@/features/dashboard/components/BarChart";
import PieChart from "@/features/dashboard/components/PieChart";
import { ActiveCoursesTable } from "@/features/dashboard/components/ActiveCourseTable";
import { Button } from "@/components/Button/page";
import { Plus } from "lucide-react";
import { CustomCard } from "@/components/ui/card";
import Image from "next/image";

const AdminDashboard = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <MetricCard title="Total Students" value="1200" bgColor="#FF5656" />
            <MetricCard title="Active Courses" value="30" bgColor="#32BA77" />
            <MetricCard
              title="Pending Assessments"
              value="20"
              bgColor="#FBC11B"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 my-6">
            <div className="h-full lg:h-[388px] w-full lg:w-2/3 flex flex-col gap-4 lg:gap-8 bg-white p-4 rounded-lg">
              <div className="flex justify-between">
                <h1 className="text-xs lg:text-base font-medium">
                  Student Performance by Course
                </h1>
                <Image
                  src="/icons/dots-grey.svg"
                  width={27}
                  height={5}
                  alt="dots"
                />
              </div>
              <BarChart />
            </div>

            <div className="h-full lg:h-[388px] w-full lg:w-1/3 flex flex-col gap-4 lg:gap-8 bg-white p-4 rounded-lg">
              <div className="flex justify-between">
                <h1 className="text-xs lg:text-base font-medium">
                  Assessment Completion
                </h1>
                <Image
                  src="/icons/dots-grey.svg"
                  width={27}
                  height={5}
                  alt="dots"
                />
              </div>
              <PieChart />
            </div>
          </div>

          <div className="flex bg-white flex-col p-4 lg:p-6 rounded-lg gap-4 lg:gap-8">
            <h1 className="text-xs lg:text-base font-bold text-center">
              Active courses
            </h1>

            <ActiveCoursesTable />
            <div className="flex justify-center">
              <Button
                size="lg"
                className="flex items-center gap-1 bg-white border border-[#0000FF] px-4 py-2 hover:bg-white"
              >
                <Plus className="h-4 w-4 text-black" />
                <span className="text-black">Create new course</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <div className="flex flex-col gap-4 bg-white p-4 lg:p-6 rounded-lg">
            <h1 className="text-center text-base font-bold">Assessments</h1>
            <div className="mb-2">
              <CustomCard
                title="Ongoing Assessments"
                actions={
                  <Image
                    src="/icons/Group 27.svg"
                    width={27}
                    height={5}
                    alt="dots"
                  />
                }
                className="border-none shadow-none"
              >
                <div className="space-y-2">
                  <CourseItem
                    courseCode="CHM 101"
                    courseTitle="Introduction to chemistry"
                  />
                  <CourseItem
                    courseCode="ZOO 101"
                    courseTitle="Introduction to zoology"
                  />
                  <CourseItem
                    courseCode="PHY 101"
                    courseTitle="Introduction to physics"
                  />
                </div>
              </CustomCard>
            </div>

            <div className="mb-2">
              <CustomCard
                title="Pending Assessments"
                actions={
                  <Image
                    src="/icons/Group 27.svg"
                    width={27}
                    height={5}
                    alt="dots"
                  />
                }
                className="border-none shadow-none"
              >
                <div className="space-y-2">
                  <CourseItem
                    courseCode="CHM 101"
                    courseTitle="Introduction to chemistry"
                  />
                  <CourseItem
                    courseCode="ZOO 101"
                    courseTitle="Introduction to zoology"
                  />
                  <CourseItem
                    courseCode="PHY 101"
                    courseTitle="Introduction to physics"
                  />
                </div>
              </CustomCard>
            </div>

            <div>
              <CustomCard
                title="Completed Assessments"
                actions={
                  <Image
                    src="/icons/Group 27.svg"
                    width={27}
                    height={5}
                    alt="dots"
                  />
                }
                className="border-none shadow-none"
              >
                <div className="space-y-2">
                  <CourseItem
                    courseCode="CHM 101"
                    courseTitle="Introduction to chemistry"
                  />
                  <CourseItem
                    courseCode="ZOO 101"
                    courseTitle="Introduction to zoology"
                  />
                  <CourseItem
                    courseCode="PHY 101"
                    courseTitle="Introduction to physics"
                  />
                </div>
              </CustomCard>
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                className="flex items-center gap-1 bg-white border border-[#0000FF] px-4 py-2 hover:bg-white"
              >
                <Plus className="h-4 w-4 text-black" />
                <span className="text-black"> Add Assessment</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
