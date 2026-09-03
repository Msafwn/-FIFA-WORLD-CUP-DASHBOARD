export default function MatchCard({ match }) {
  const { homeTeam, awayTeam, score, status, utcDate, stage, group, referees } = match;

  const getStatusBadge = () => {
    switch (status) {
      case 'FINISHED':
        return (
          <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-bold px-2 py-0.5 rounded">
            FT
          </span>
        );
      case 'LIVE':
      case 'IN_PLAY':
        return (
          <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded animate-pulse shadow-sm shadow-orange-500/20">
            LIVE
          </span>
        );
      default:
        return (
          <span className="bg-orange-50 text-orange-600 border border-orange-100 text-[9px] font-bold px-2 py-0.5 rounded">
            UPCOMING
          </span>
        );
    }
  };

  const formattedDate = new Date(utcDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const stageFormatted = stage
    ? stage.replace('_', ' ')
    : group 
      ? group.replace('_', ' ') 
      : 'WORLD CUP';

  return (
    <div className="group relative overflow-hidden bg-white border border-slate-200 hover:border-orange-500/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Top Details info line */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
        <span>{stageFormatted}</span>
        {getStatusBadge()}
      </div>

      {/* Main score line */}
      <div className="grid grid-cols-7 items-center gap-2 mb-4">
        
        {/* Home Team */}
        <div className="col-span-2 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-slate-50 border border-slate-150 rounded-xl p-1.5 flex items-center justify-center shadow-inner mb-2">
            <img src={homeTeam.crest} alt={homeTeam.name} className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-black text-slate-800 truncate max-w-full leading-tight">
            {homeTeam.shortName || homeTeam.name}
          </span>
        </div>

        {/* Home Score */}
        <div className="col-span-1 text-center">
          <span className={`text-xl md:text-2xl font-black ${status === 'FINISHED' ? 'text-slate-800' : 'text-slate-400'}`}>
            {status === 'FINISHED' || status === 'IN_PLAY' ? score.fullTime.home : '-'}
          </span>
        </div>

        {/* Vs Separator */}
        <div className="col-span-1 flex flex-col items-center justify-center text-center text-slate-400">
          <span className="text-[10px] font-black tracking-widest uppercase">VS</span>
        </div>

        {/* Away Score */}
        <div className="col-span-1 text-center">
          <span className={`text-xl md:text-2xl font-black ${status === 'FINISHED' ? 'text-slate-800' : 'text-slate-400'}`}>
            {status === 'FINISHED' || status === 'IN_PLAY' ? score.fullTime.away : '-'}
          </span>
        </div>

        {/* Away Team */}
        <div className="col-span-2 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-slate-50 border border-slate-150 rounded-xl p-1.5 flex items-center justify-center shadow-inner mb-2">
            <img src={awayTeam.crest} alt={awayTeam.name} className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-black text-slate-800 truncate max-w-full leading-tight">
            {awayTeam.shortName || awayTeam.name}
          </span>
        </div>

      </div>

      {/* Bottom details: date & venue/referee */}
      <div className="flex flex-col gap-1 border-t border-slate-100 pt-3 text-[10px] text-slate-400 font-semibold">
        <div className="flex justify-between">
          <span>Date & Time:</span>
          <span className="text-slate-700 font-bold">{formattedDate}</span>
        </div>
        {referees && referees.length > 0 && (
          <div className="flex justify-between">
            <span>Referee:</span>
            <span className="text-slate-500">{referees[0].name} ({referees[0].nationality})</span>
          </div>
        )}
      </div>

    </div>
  );
}
