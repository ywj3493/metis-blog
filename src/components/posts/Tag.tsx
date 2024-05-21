type TagProps = {
  name: string;
  color: string;
};

export default function Tag({ name }: TagProps) {
  return (
    <div className={`bg-green-100 py-4 px-12 text-12 rounded-4`}>{name}</div>
  );
}
