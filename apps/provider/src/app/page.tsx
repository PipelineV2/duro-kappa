"use client";
export default function Home() {
  return (
    <div className="w-full">
      <div className="w-full _text-center mx-auto mt-16">
        <div className="mb-16">
          <div className="_px-4 _py-3 _bg-gray-800 _text-white max-w-max text-4xl mb-4"> problem ...</div>
          <div className="text-xl"> your customers need to queue up for one of your services, and...
            your premises is not big enough, <br /> hereby leading to you losing customers
            who would not want to stand in a queue for a very long time.
          </div>
        </div>


        <div className="mb-5">
          <div className="_px-4 _py-3 _bg-gray-800 _text-white max-w-max text-4xl mb-4"> how DURO helps ... </div>
          <div className="text-xl">
            <div className="mb-5">
              when you sign up on duro, you can create queues which each will have qr codes attached to them. <br />
              these qr codes (and/or) the queue's unique url can be displayed in various places. (literally, anywhere you want.)
            </div>
            <div className="w-[4rem] my-6 border-b-2 border-gray-800 mx-auto"> </div>
            <div className="mb-5">
              your customers can then scan these qr codes or enter the unique link in their browsers and join your queue from there. <br />
              you can advance the queue and dismiss users as the queue progresses easily through the admin dashboard. <br />
            </div>
            <div className="w-[4rem] my-6 border-b-2 border-gray-800 mx-auto"> </div>
            <div className="mb-5">
              the admin dashboard also allows you to add more branches as your business expands. and each business will have its own admin and queues.

            </div>
            convinced yet?
          </div>
        </div>
      </div>
    </div>
  )
}
