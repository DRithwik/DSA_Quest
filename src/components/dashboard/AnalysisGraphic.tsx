export const AnalysisGraphic = () => {
  return (
    <div className="flex justify-center items-center h-48 bg-secondary/30 rounded-lg overflow-hidden">
      <div className="flex items-end gap-2 h-24">
        <div className="w-4 bg-primary animate-pulse [animation-delay:-0.3s]" style={{ height: '60%' }} />
        <div className="w-4 bg-primary animate-pulse [animation-delay:-0.15s]" style={{ height: '80%' }} />
        <div className="w-4 bg-primary animate-pulse" style={{ height: '70%' }} />
        <div className="w-4 bg-primary animate-pulse [animation-delay:-0.2s]" style={{ height: '90%' }} />
        <div className="w-4 bg-primary animate-pulse [animation-delay:-0.1s]" style={{ height: '75%' }} />
      </div>
    </div>
  );
};
