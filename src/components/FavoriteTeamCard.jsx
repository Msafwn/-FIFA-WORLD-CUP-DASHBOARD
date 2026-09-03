export default function FavoriteTeamCard() {
  const team = {
    name: 'Portugal',
    flag: '🇵🇹',
    crest: 'https://crests.football-data.org/765.svg',
    ranking: '6',
    wins: '2',
    goals: '8',
    recentForm: [
      { result: 'D', score: '1-1', opp: 'Congo DR' },
      { result: 'W', score: '5-0', opp: 'Uzbekistan' },
      { result: 'D', score: '0-0', opp: 'Colombia' },
      { result: 'W', score: '2-1', opp: 'Croatia' },
      { result: 'L', score: '0-1', opp: 'Spain' }
    ],
    topPlayers: [
      { name: 'Cristiano Ronaldo', pos: 'Forward', age: 41, goals: 5 },
      { name: 'Bruno Fernandes', pos: 'Midfielder', age: 31, goals: 2 },
      { name: 'Bernardo Silva', pos: 'Midfielder', age: 31, goals: 1 },
      { name: 'Rafael Leão', pos: 'Winger', age: 27, goals: 0 }
    ]
  };

  return (
    <div className="relative group overflow-hidden rounded-3xl bg-white border-2 border-orange-100 p-6 md:p-8 shadow-md hover:border-orange-500/40 transition-all duration-300">
      
      {/* Animated glowing lines inside card - Light Theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      {/* Background Decorative Crest */}
      <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 opacity-5 pointer-events-none select-none">
        <img src={team.crest} alt="Crest bg" className="w-full h-full object-contain opacity-5" />
      </div>

      <div className="relative z-10 flex flex-col xl:flex-row gap-8 items-stretch">
        
        {/* Left Column: Portugal Identity Card */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500 text-white text-xs font-black tracking-widest uppercase animate-pulse shadow-sm">
                ⭐ MY CHAMPION
              </span>
              <span className="text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">{team.flag}</span>
            </div>

            {/* Team Identity */}
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 bg-slate-50 border border-slate-150 rounded-2xl p-2.5 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                <img src={team.crest} alt={team.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-none mb-1 group-hover:text-orange-500 transition-colors">
                  {team.name}
                </h2>
                <p className="text-sm text-slate-500 font-semibold tracking-wide uppercase">Federação Portuguesa de Futebol</p>
              </div>
            </div>

            {/* General Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 text-center shadow-inner">
                <span className="block text-[10px] text-slate-400 font-bold tracking-wider uppercase mb-1">FIFA RANK</span>
                <span className="text-xl font-extrabold text-slate-800">#{team.ranking}</span>
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 text-center shadow-inner">
                <span className="block text-[10px] text-slate-400 font-bold tracking-wider uppercase mb-1">WC WINS</span>
                <span className="text-xl font-extrabold text-orange-655">{team.wins}</span>
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 text-center shadow-inner">
                <span className="block text-[10px] text-slate-400 font-bold tracking-wider uppercase mb-1">WC GOALS</span>
                <span className="text-xl font-extrabold text-slate-800">{team.goals}</span>
              </div>
            </div>
          </div>

          {/* Recent Performance Track */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">RECENT WORLD CUP FORM</h4>
            <div className="flex items-center gap-2">
              {team.recentForm.map((match, i) => (
                <div 
                  key={i} 
                  className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-lg border text-center shadow-sm group/form relative cursor-default hover:-translate-y-0.5 transition-transform ${
                    match.result === 'W' 
                      ? 'bg-orange-100 border-orange-200 text-orange-600' 
                      : match.result === 'D' 
                        ? 'bg-slate-100 border-slate-200 text-slate-600' 
                        : 'bg-red-50 border-red-200 text-red-600'
                  }`}
                >
                  <span className="text-xs font-black">{match.result}</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">{match.score}</span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 bg-slate-900 border border-slate-700 text-white text-[9px] py-1 px-2 rounded opacity-0 pointer-events-none group-hover/form:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20">
                    {match.opp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Key Star Players */}
        <div className="flex-1 bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold tracking-wider text-orange-500 uppercase mb-4 flex items-center gap-2">
              ⚽ PORTUGUESE TALENTS
            </h3>
            
            <div className="flex flex-col gap-3">
              {team.topPlayers.map((player, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-150 hover:border-orange-500/30 hover:shadow-sm transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-750 shadow-inner">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-none mb-1">{player.name}</h4>
                      <p className="text-[10px] text-slate-500">{player.pos} • Age {player.age}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-orange-500">{player.goals} ⚽</span>
                    <p className="text-[9px] text-slate-400 uppercase font-semibold">Goals</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 text-center text-[10px] text-slate-500 font-semibold tracking-wide italic">
            "Portugal is a powerhouse of skill and passion."
          </div>
        </div>

      </div>
    </div>
  );
}
