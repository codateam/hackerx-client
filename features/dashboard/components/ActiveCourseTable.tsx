import { Button } from "@/components/Button/page";

export function ActiveCoursesTable() {
  const courses = [
    { code: "CSC 104", title: "CSC 104", students: 8 },
    { code: "CSC 426", title: "CSC 426", students: 5 },
    { code: "CSC 446", title: "CSC 446", students: 7 },
    { code: "CSC 420", title: "CSC 420", students: 5 },
    { code: "CSC 450", title: "CSC 450", students: 10 },
  ];

  return (
    <div className="overflow-x-auto ">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-semibold text-sm lg:text-base">
              Course Title
            </th>
            <th className="text-left py-2 font-semibold text-sm lg:text-base">
              Students
            </th>
            <th className="py-2 font-semibold text-sm lg:text-base text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.code} className="border-b">
              <td className="py-2">{course.title}</td>
              <td className="py-2">{course.students}</td>
              <td className="py-2">
                <div className="flex gap-2">
                  <Button className="w-full">View</Button>
                  <Button className="w-full">Edit</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
