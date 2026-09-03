export default function PlayerCard({ scorer, rank }) {
  const { player, team, playedMatches, goals, assists } = scorer;

  return (
    <div className="group relative overflow-hidden bg-white border border-slate-200 hover:border-orange-500/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {/* Visual rank circle */}
      <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-orange-600 flex items-center justify-center border border-orange-400 shadow-sm z-10">
        <span className="text-white text-xs font-black pt-1 pl-1">#{rank}</span>
      </div>

      <div className="flex items-center gap-4 mb-4 mt-2">
        {/* Team Logo Badge */}
        <div className="w-12 h-12 bg-slate-50 border border-slate-150 rounded-xl p-1.5 flex items-center justify-center shadow-inner">
          <img src={team.crest} alt={team.name} className="w-full h-full object-contain" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-800 leading-tight mb-0.5 group-hover:text-orange-500 transition-colors">
            {player.name}
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            {player.section || 'Forward'} • {player.nationality}
          </p>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
        <div>
          <span className="block text-[8px] text-slate-400 font-bold uppercase">MATCHES</span>
          <span className="text-sm font-black text-slate-700">{playedMatches || '0'}</span>
        </div>
        <div>
          <span className="block text-[8px] text-slate-400 font-bold uppercase">GOALS</span>
          <span className="text-sm font-black text-orange-500">{goals || '0'}</span>
        </div>
        <div>
          <span className="block text-[8px] text-slate-400 font-bold uppercase">ASSISTS</span>
          <span className="text-sm font-black text-slate-700">{assists || '0'}</span>
        </div>
      </div>
    </div>
  );
}
