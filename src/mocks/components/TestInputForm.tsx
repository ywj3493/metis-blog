"use client";

import { useEffect, useRef, useState } from "react";
import type { TestEmployee, TestEmployeeRequest } from "../api/test";

interface TestEmployeeItemProps extends TestEmployee {
  onClickDelete: () => void;
}

function TestEmployeeItem({
  name,
  age,
  empNumber,
  onClickDelete,
}: TestEmployeeItemProps) {
  return (
    <div className="grid h-48 grid-cols-4 items-center rounded-5 border-blue-200 bg-white p-8">
      <div className="font-r-16 text-black">{`사번: ${empNumber}`}</div>
      <div className="font-r-16 text-black">{`이름: ${name}`}</div>
      <div className="font-r-16 text-black">{`나이: ${age}`}</div>
      <button
        type="button"
        className="rounded-5 bg-red-600 p-5 text-white"
        onClick={onClickDelete}
      >
        delete
      </button>
    </div>
  );
}

const getTestEmployee = async () => {
  const res = await fetch("/emplyee");
  const data = await res.json();

  return data;
};

const postTestEmployee = async (request: TestEmployeeRequest) => {
  const res = await fetch("/employee", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await res.json();

  return data;
};

const deleteTestEmployee = async (empNumber: string) => {
  const res = await fetch(`/employee/${empNumber}`, {
    method: "DELETE",
  });
  const data = await res.json();

  return data;
};

export function TestInputForm() {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const ageInputRef = useRef<HTMLInputElement>(null);

  const [employees, setEmployees] = useState<TestEmployee[]>([]);

  const handlePost = async () => {
    const name = nameInputRef.current?.value;
    const age = ageInputRef.current?.value;
    if (!!name && !!age) {
      await postTestEmployee({
        name: name,
        age: Number.parseInt(age),
      });
    }
  };

  const handleDelete = async (empNumber: string) => {
    await deleteTestEmployee(empNumber);
  };

  useEffect(() => {
    const fetch = async () => {
      const data = await getTestEmployee();
      setEmployees(data);
    };
    try {
      fetch();
    } catch (e) {}
  }, []);

  return (
    <>
      <div className="flex flex-col gap-10">
        {employees?.map(({ name, age, empNumber }) => (
          <TestEmployeeItem
            key={empNumber}
            name={name}
            age={age}
            empNumber={empNumber}
            onClickDelete={() => handleDelete(empNumber)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-20">
        <div className="font-r-16 text-black">Name</div>
        <input ref={nameInputRef} placeholder="name" />
        <div className="font-r-16 text-black">Age</div>
        <input ref={ageInputRef} type="number" placeholder="age" />
        <button
          type="button"
          className="rounded-5 bg-cyan-700 p-5 text-white"
          onClick={handlePost}
        >
          POST
        </button>
      </div>
    </>
  );
}
