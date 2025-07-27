import { Button } from "@/components/Button/page"

export default function ProgressReport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Student Progress Report</h1>
            <p className="text-blue-100 mt-2">Academic Performance Overview</p>
          </div>

        

          <div className="p-6 sm:p-8">
            {/* Student Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm border-l-4 border-l-blue-500">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Student Information</h2>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="text-gray-800">Ruqoyat Babalola</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium text-gray-600">Session:</span>
                      <span className="text-gray-800">Section 4</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm border-l-4 border-l-green-500">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Academic Period</h2>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium text-gray-600">Grading Period:</span>
                      <span className="text-gray-800">Second Semester</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium text-gray-600">Final Year:</span>
                      <span className="text-gray-800">2025 (Graduating 2025)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grades Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800">Academic Performance</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                        <th className="text-white p-4 text-left font-semibold rounded-tl-lg">Subject</th>
                        <th className="text-white p-4 text-center font-semibold">Semester 1</th>
                        <th className="text-white p-4 text-center font-semibold rounded-tr-lg">Semester 2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                       { subject: "CSC450 - Artificial Intelligence", sem1: "85", sem2: "89" },
                       { subject: "CSC423 - Compiler Construction", sem1: "78", sem2: "83" },
                       { subject: "CSC411 - Machine Learning", sem1: "80", sem2: "86" },
                       { subject: "CSC465 - Distributed Systems", sem1: "82", sem2: "88" },
                       { subject: "CSC401 - Data Mining", sem1: "79", sem2: "84" }
                      ].map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium text-gray-800 border-b border-gray-200">{row.subject}</td>
                          <td className="p-4 text-center border-b border-gray-200">
                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                              {row.sem1}
                            </span>
                          </td>
                          <td className="p-4 text-center border-b border-gray-200">
                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                              {row.sem2}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>          

            {/* Footer Buttons */}
            <div className="flex justify-between pt-6">
              <Button 
                variant="default" 
                className=" px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Back
              </Button>
              <Button 
                variant="default" 
                className="px-8 py-3 rounded-lg font-medium transition-colors"
              >
                🖨️ Print Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}