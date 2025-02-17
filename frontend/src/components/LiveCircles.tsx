const LiveCircle = () => (
    <div className="flex items-center justify-between p-3">
      <div className="flex flex-col items-center gap-1">
        <div className="w-[45px] h-[45px] rounded-full bg-slate-300"></div>
        <span className="text-xs font-semibold">Me</span>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className={`${i !== 0 ? '-ml-6' : ''} border-2 border-black w-[45px] h-[45px] rounded-full bg-slate-300`} />
        ))}
        <span className="text-xs font-semibold ml-2">+200</span>
      </div>
    </div>
  );

  export default LiveCircle;