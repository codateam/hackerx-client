import { Button } from "@/components/Button/page";
import React from "react";

const AssessmentGradesTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 font-medium">Course</th>
            <th className="py-2 font-medium">Grade</th>
            <th className="py-2 font-medium">Update</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">
              <div>
                <p className="text-sm lg:text-base font-medium">CSC 104</p>
              </div>
            </td>
            <td className="py-2">
              <div>
                <p className="text-sm lg:text-base  font-medium">40/100</p>
                <p className="text-xs lg:text-sm text-gray-500">Final Grade</p>
              </div>
            </td>
            <td className="py-2">
              <Button className="bg-[#475EDF] text-[#475EDF] font-medium rounded-lg border border-[#475EDF] hover:bg-[#475EDF] hover:text-white">
                Completed
              </Button>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2">
              <div>
                <p className="text-sm lg:text-base  font-medium">CSC 426</p>
              </div>
            </td>
            <td className="py-2">
              <div>
                <p className="text-sm lg:text-base font-medium">90/100</p>
                <p className="text-xs lg:text-sm text-gray-500">Final Grade</p>
              </div>
            </td>
            <td className="py-2">
              <Button className="bg-[#475EDF] text-[#475EDF] font-medium rounded-lg border border-[#475EDF] hover:bg-[#475EDF] hover:text-white">
                Completed
              </Button>
            </td>
          </tr>
          <tr>
            <td className="py-2">
              <div>
                <p className="text-sm lg:text-base font-medium">CSC 446</p>
              </div>
            </td>
            <td className="py-2">
              <div>
                <p className="text-sm lg:text-base font-medium">76/100</p>
                <p className="text-xs lg:text-sm text-gray-500">Final Grade</p>
              </div>
            </td>
            <td className="py-2">
              <Button className="bg-[#FBC11B] text-[#FBC11B] font-medium rounded-lg border border-[#FBC11B] hover:bg-[#FBC11B] hover:text-white">
                Upcoming
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AssessmentGradesTable;
