export default function TeamCard({ team, details }) {
  const group = details?.group || 'N/A';
  const rank = details?.rank || 'N/A';
  const played = details?.played !== undefined ? details.played : 0;
  const points = details?.points !== undefined ? details.points : 0;

  return (
    <div className="group relative overflow-hidden bg-white border border-slate-200 hover:border-orange-500/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      {/* Subtle orange border shine on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div>
        {/* Top: Crest & Group Indicator */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-16 h-16 bg-slate-50 border border-slate-150 rounded-xl p-2 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
            <img 
              src={team.crest} 
              alt={team.name} 
              className="w-full h-full object-contain" 
              loading="lazy"
            />
          </div>
          <div className="flex flex-col items-end">
            <span className="bg-orange-500/10 border border-orange-500/20 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              GROUP {group}
            </span>
            {rank !== 'N/A' && (
              <span className="text-[10px] text-slate-550 font-bold uppercase mt-1">
                Rank #{rank}
              </span>
            )}
          </div>
        </div>

        {/* Middle: Names */}
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-800 leading-tight mb-1 group-hover:text-orange-500 transition-colors">
            {team.name}
          </h3>
          <p className="text-xs text-slate-500 font-semibold tracking-wide">
            {team.area?.name || 'International'}
          </p>
        </div>
      </div>

      {/* Bottom: Mini-stats */}
      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
        <div>
          <span className="block text-[9px] text-slate-400 font-bold uppercase">PLAYED</span>
          <span className="text-xs font-black text-slate-800">{played}</span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-400 font-bold uppercase">POINTS</span>
          <span className="text-xs font-black text-orange-600">{points}</span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-400 font-bold uppercase">FOUNDED</span>
          <span className="text-[10px] font-semibold text-slate-500">{team.founded || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
