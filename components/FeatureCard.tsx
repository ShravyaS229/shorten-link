interface Props {
  title: string;
  description: string;
}

export default function FeatureCard({
  title,
  description,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500">
      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-slate-400">
        {description}
      </p>
    </div>
  );
}