import Branch from './branch';

export default function Page({ params: { branch } }: { params: { branch: string } }) {
  return (
    <div className="w-[10rem] h-max mx-auto mt-[2rem]">
      <Branch branch={branch} />
    </div>
  );
}
