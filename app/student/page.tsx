"use client";

import { MetricCard } from "@/features/dashboard/components/MetricCard";
import { BarChart } from "@/features/dashboard/components/BarChart";
import { Button } from "@/components/Button/page";
import { Plus } from "lucide-react";
import Image from "next/image";
import AssessmentGradesTable from "@/features/dashboard/components/AssessmentGradesTable";
import PieChart from "@/features/dashboard/components/PieChart";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col gap-4 lg:gap-6 h-full w-full">
            <MetricCard
              title="Assessments In Progress"
              value="5"
              bgColor="#FF5656"
            />
            <MetricCard
              title="Assessments Completed"
              value="3"
              bgColor="#32BA77"
            />
          </div>
          <div className="h-full lg:h-[388px] flex flex-col gap-4 lg:gap-8 bg-white p-4 rounded-lg">
            <div className="flex justify-between">
              <h1 className="text-xs lg:text-base font-medium">
                Performance Trends
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

          <div className="h-full lg:h-[388px] flex flex-col gap-4 lg:gap-8 bg-white p-4 rounded-lg">
            <div className="flex justify-between">
              <h1 className="text-xs lg:text-base font-medium">
                Semester Grades
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col gap-4 bg-white p-4 lg:p-6 rounded-lg">
            <div className="flex justify-between mb-2">
              <h1 className="text-xs lg:text-base font-medium">
                Ongoing Assessments
              </h1>
              <Image
                src="/icons/dots-grey.svg"
                width={27}
                height={5}
                alt="dots"
              />
            </div>
            <AssessmentList
              items={[
                {
                  code: "CSC 422",
                  title: "Data Communication and Networks",
                  buttonText: "Start",
                },
                {
                  code: "CSC 420",
                  title: "Software Engineering",
                  buttonText: "Start",
                },
                {
                  code: "CSC450",
                  title: "Organization of Programming Languages",
                  buttonText: "Start",
                },
              ]}
            />
          </div>
          <div className="flex flex-col gap-4 bg-white p-4 lg:p-6 rounded-lg">
            <div className="flex justify-between mb-2">
              <h1 className="text-xs lg:text-base font-medium">
                Pending Assessments
              </h1>
              <Image
                src="/icons/dots-grey.svg"
                width={27}
                height={5}
                alt="dots"
              />
            </div>
            <AssessmentList
              items={[
                {
                  code: "CSC 422",
                  title: "Data Communication and Networks",
                  buttonText: "Start",
                },
                {
                  code: "CSC 420",
                  title: "Software Engineering",
                  buttonText: "Start",
                },
                {
                  code: "CSC450",
                  title: "Organization of Programming Languages",
                  buttonText: "Start",
                },
              ]}
            />
          </div>
          <div className="flex flex-col gap-4 bg-white p-4 lg:p-6 rounded-lg">
            <div className="flex justify-between mb-2">
              <h1 className="text-xs lg:text-base font-medium">
                Completed Assessments
              </h1>
              <Image
                src="/icons/dots-grey.svg"
                width={27}
                height={5}
                alt="dots"
              />
            </div>
            <AssessmentList
              items={[
                {
                  code: "CSC 104",
                  title: "Introduction to Programming",
                  buttonText: "Check Result",
                },
                {
                  code: "CSC 446",
                  title: "Computer graphics",
                  buttonText: "Check Result",
                },
                {
                  code: "CSC 426",
                  title: "Introduction to Artificial Intelligence",
                  buttonText: "Check Result",
                },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-end gap-4 mb-6 w-full">
          <div className="flex flex-col gap-4 lg:gap-6 w-full lg:w-2/3 bg-white p-4 lg:p-6 rounded-lg">
            <h1>My Assignments</h1>
            <AssessmentGradesTable />
          </div>
          <div className="flex justify-center items-center h-full lg:h-[293px] w-full lg:w-1/3 bg-white rounded-lg place-items-end">
            <Button
              size="lg"
              className="flex items-center gap-1 bg-white border border-black px-4 py-2 hover:bg-white"
              onClick={() => router.push('/student/enrollments/new')}
            >
              <Plus className="h-4 w-4 text-black" />
              <span className="text-black"> Add new course</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AssessmentListProps {
  items: {
    code: string;
    title: string;
    buttonText: string;
  }[];
}

function AssessmentList({ items }: AssessmentListProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center gap-2">
          <div>
            <p className="text-sm lg:text-base font-medium">{item.code}</p>
            <p className="text-xs lg:text-sm text-gray-500">{item.title}</p>
          </div>
          <Button size="sm">{item.buttonText}</Button>
        </div>
      ))}
    </div>
  );
}
