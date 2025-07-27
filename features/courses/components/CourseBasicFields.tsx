import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseBasicFieldsProps } from "@/types/course";


export const CourseBasicFields: React.FC<CourseBasicFieldsProps> = ({
  courseData,
  handleChange,
  handleCustomChange,
  handleNumberChange,
}) => {
  const fieldClasses = "w-full md:w-[500px] border border-[#0000FF] focus:border-[#0000FF] focus:ring-0 focus:outline-none md:px-6 rounded-md";
  const labelClasses = "block mb-2 font-medium text-xs lg:text-base";

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <label htmlFor="title" className={labelClasses}>
          Course Name
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          value={courseData.title || ""}
          onChange={handleChange}
          className={fieldClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="code" className={labelClasses}>
          Course code
        </label>
        <Input
          id="code"
          name="code"
          type="text"
          value={courseData.code || ""}
          onChange={handleChange}
          className={fieldClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>
          Course Description
        </label>
        <Input
          id="description"
          name="description"
          type="text"
          value={courseData.description || ""}
          onChange={handleChange}
          className={fieldClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="creditUnit" className={labelClasses}>
          Credit Unit
        </label>
        <Input
          id="creditUnit"
          name="creditUnit"
          type="number"
          min="1"
          max="10"
          value={String(courseData?.creditUnit || "")}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value)) {
              handleNumberChange("creditUnit", value);
            }
          }}
          className={fieldClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="level" className={labelClasses}>
          Level
        </label>
        <Select
          value={courseData.level ? courseData.level.toString() : "100"}
          onValueChange={(val) => handleCustomChange("level", val)}
        >
          <SelectTrigger
            id="level"
            className="w-full md:px-6 py-3 border border-[#0000FF] focus:ring-0 focus:outline-none rounded-md"
          >
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {[100, 200, 300, 400, 500].map(level => (
              <SelectItem key={level} value={level.toString()}>
                {level} Level
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="semester" className={labelClasses}>
          Semester
        </label>
        <Select
          value={courseData.semester || "First"}
          onValueChange={(val) => handleCustomChange("semester", val)}
        >
          <SelectTrigger
            id="semester"
            className="w-full md:px-6 py-3 border border-[#0000FF] focus:ring-0 focus:outline-none rounded-md"
          >
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="First">First Semester</SelectItem>
            <SelectItem value="Second">Second Semester</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="department" className="block mb-2 font-medium">
          Department
        </label>
        <Input
          id="department"
          name="department"
          type="text"
          value={courseData.department || ""}
          onChange={handleChange}
          className={fieldClasses}
          required
        />
      </div>
    </div>
  );
};
