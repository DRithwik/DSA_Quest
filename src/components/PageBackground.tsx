import React from "react";

const PageBackground = () => {
  return (
    <>
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "#080810" }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 hero-grid" />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-30"
             style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.4) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20"
             style={{ background: "radial-gradient(ellipse, rgba(56,189,248,0.5) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20"
             style={{ background: "radial-gradient(ellipse, rgba(236,72,153,0.5) 0%, transparent 70%)" }} />
      </div>
    </>
  );
};

export default PageBackground;
