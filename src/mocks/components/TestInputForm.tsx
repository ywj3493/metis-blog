"use client";

import axios from "axios";
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
    <div className="grid grid-cols-4 h-48 rounded-5 border-blue-200 items-center bg-white p-8">
      <div className="font-r-16 text-black">{`사번: ${empNumber}`}</div>
      <div className="font-r-16 text-black">{`이름: ${name}`}</div>
      <div className="font-r-16 text-black">{`나이: ${age}`}</div>
      <button
        type="button"
        className="bg-red-600 text-white p-5 rounded-5"
        onClick={onClickDelete}
      >
        delete
      </button>
    </div>
  );
}

const getTestEmployee = async () => {
  const { data } = await axios.get<TestEmployee[]>("/emplyee");

  return data;
};

const postTestEmployee = async (request: TestEmployeeRequest) => {
  const { data } = await axios.post<TestEmployeeRequest>("/employee", request);

  return data;
};

const deleteTestEmplyee = async (empNumber: string) => {
  const { data } = await axios.delete(`/employee/${empNumber}`);

  return data;
};

export function TestInputForm() {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const ageInputRef = useRef<HTMLInputElement>(null);

  const [employees, setEmployees] = useState<TestEmployee[]>([]);

  const [postTrigger, setPostTrigger] = useState(false);

  const handlePost = async () => {
    const name = nameInputRef.current?.value;
    const age = ageInputRef.current?.value;
    if (!!name && !!age) {
      await postTestEmployee({
        name: name,
        age: Number.parseInt(age),
      });
    }
    setPostTrigger((prev) => !prev);
  };

  const handleDelete = async (empNumber: string) => {
    await deleteTestEmplyee(empNumber);
    setPostTrigger((prev) => !prev);
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
          className="bg-cyan-700 text-white p-5 rounded-5"
          onClick={handlePost}
        >
          POST
        </button>
      </div>
    </>
  );
}
