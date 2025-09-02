import { HttpResponse, http } from "msw";

const employeeEntity = new Map<string, TestEmployee>();

export type TestEmployeeParams = {
  empNumber: string;
};

export interface TestEmployee {
  empNumber: string;
  name: string;
  age: number;
}

export interface TestEmployeeRequest {
  name: string;
  age: number;
}

interface TestEmployeeResponse extends TestEmployee {}

export const testController = [
  http.get<
    TestEmployeeParams,
    TestEmployeeRequest,
    TestEmployeeResponse[],
    "/emplyee"
  >("/emplyee", () => {
    return HttpResponse.json(Array.from(employeeEntity.values()));
  }),
  http.post<never, TestEmployeeRequest, TestEmployeeResponse>(
    "/employee",
    async ({ request }) => {
      const newEmployee = await request.json();

      const newEmpNumber = `${employeeEntity.size + 1}`;

      employeeEntity.set(newEmpNumber, {
        empNumber: newEmpNumber,
        ...newEmployee,
      });

      return HttpResponse.json(employeeEntity.get(newEmpNumber), {
        status: 201,
      });
    },
  ),
  http.delete<TestEmployeeParams, never, never, "/employee/:empNumber">(
    "/employee/:empNumber",
    ({ params }) => {
      const employee = employeeEntity.get(params.empNumber);
      if (employee) {
        employeeEntity.delete(employee.empNumber);
        return HttpResponse.json(employee);
      }
      return HttpResponse.json(null, { status: 404 });
    },
  ),
];
