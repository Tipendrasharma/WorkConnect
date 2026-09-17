import React from "react";

const WorkerCardSkeleton = () => (
  <div className="glass-card p-4 flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <div className="skeleton w-16 h-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
    <div className="skeleton h-4 w-full" />
    <div className="skeleton h-4 w-2/3" />
    <div className="flex gap-2">
      <div className="skeleton h-9 flex-1" />
      <div className="skeleton h-9 flex-1" />
    </div>
    <div className="skeleton h-9 w-full" />
  </div>
);

export default WorkerCardSkeleton;
