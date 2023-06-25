import Jumbotron from '@/components/jumbotron';

function Layout({ jumbotronCta, jumbotronText, Left, children }: {
  children: React.ReactNode;
  Left: React.ReactNode
  jumbotronCta?: React.ReactNode
  jumbotronText?: string
}) {
  return (
    <div className="w-full h-max mt-[5rem]">
      <div className="mx-auto">
        <Jumbotron
          className="text-lg"
          text={jumbotronText || ""}
          cta={jumbotronCta}
        />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-20">
          {Left}
          <div className='w-full _min-h-screen'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
