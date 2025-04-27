import Link from "next/link";

export default function Home() {
  return (
    <div className="flex gap-10">
    
      AI Resume Builder

      <Link className="bg-primary" href={'/resumes'}>
      Resumes
      </Link>
      <Link className="bg-primary" href={'/resumes/editor'}>
      Editor
      </Link>
    </div>
  );
}
