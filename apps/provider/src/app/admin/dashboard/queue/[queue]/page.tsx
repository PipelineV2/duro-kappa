import Queue from './queue';

export default function Page({ params: { queue } }: { params: { queue: string } }) {
  return (
    <Queue
      queue={queue}
    />
  );
}
