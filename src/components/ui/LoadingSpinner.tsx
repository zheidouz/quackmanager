interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <span className="inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}
