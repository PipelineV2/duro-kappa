import Queue from './queue';

export default function Page({ params: { business } }: { params: { business: string } }) {
  return (
    <div className="w-[10rem] h-max mx-auto mt-[2rem]">
      <Queue business={business} />
    </div>
  );
}
