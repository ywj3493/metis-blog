export default async function TestPage() {
  const res = await fetch("/employee");

  const data = await res.json();

  return <div>{data}</div>;
}
