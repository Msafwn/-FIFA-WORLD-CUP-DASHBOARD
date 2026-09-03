export default function HeroSection({ competition, season, teamsCount, matches }) {
  // Calculate dynamic stats
  const totalMatches = matches?.length || 0;
  const finishedMatches = matches?.filter(m => m.status === 'FINISHED') || [];
  const finishedCount = finishedMatches.length;
  
  const totalGoals = finishedMatches.reduce((sum, m) => {
    return sum + (m.score?.fullTime?.home || 0) + (m.score?.fullTime?.away || 0);
  }, 0);

  const averageGoals = finishedCount > 0 
    ? (totalGoals / finishedCount).toFixed(2) 
    : '0.00';

  const trophyUrl = competition?.emblem || 'https://crests.football-data.org/wm26.png';

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-3xl p-6 md:p-10 border border-orange-200 shadow-xl mb-10 text-white">
      {/* Decorative clean white circles */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Title and Info */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            {season?.currentMatchday ? `Matchday ${season.currentMatchday}` : 'Tournament Live'}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
            {competition?.name || 'FIFA World Cup'}
          </h1>
          
          <p className="text-orange-50 text-sm md:text-base max-w-xl leading-relaxed mb-6 font-medium">
            Experience the drama, the passion, and the glory of the ultimate football tournament. 
            Track live standings, matching schedules, scorer stats, and check detailed insights for 
            world-class teams competing on the global stage.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-white text-xs font-bold">
            <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg">
              📅 {season?.startDate ? new Date(season.startDate).getFullYear() : '2026'} Edition
            </span>
            <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg">
              📍 Canada, Mexico, USA
            </span>
          </div>
        </div>

        {/* Center/Right Side: Trophy Emblem */}
        <div className="relative flex items-center justify-center w-48 h-48 md:w-56 md:h-56 bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm shadow-lg">
          {trophyUrl ? (
            <img
              src={trophyUrl}
              alt="World Cup Emblem"
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(255,255,255,0.2)]"
            />
          ) : (
            <span className="text-8xl">🏆</span>
          )}
        </div>
      </div>

      {/* Statistics Cards Row - Clean Light Theme Nested Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 relative z-10 border-t border-white/20 pt-8">
        
        {/* Stat 1 */}
        <div className="bg-white/95 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg transition-all duration-300 text-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">TOTAL TEAMS</span>
          <span className="text-2xl md:text-3xl font-black text-orange-500">{teamsCount}</span>
          <span className="text-[10px] text-slate-500 font-semibold mt-1">Qualified Nations</span>
        </div>

        {/* Stat 2 */}
        <div className="bg-white/95 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg transition-all duration-300 text-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">MATCHES</span>
          <span className="text-2xl md:text-3xl font-black text-orange-500">{totalMatches}</span>
          <span className="text-[10px] text-slate-500 font-semibold mt-1">{finishedCount} Completed</span>
        </div>

        {/* Stat 3 */}
        <div className="bg-white/95 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg transition-all duration-300 text-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">TOTAL GOALS</span>
          <span className="text-2xl md:text-3xl font-black text-orange-500">{totalGoals}</span>
          <span className="text-[10px] text-slate-500 font-semibold mt-1">Spectacular Scored</span>
        </div>

        {/* Stat 4 */}
        <div className="bg-white/95 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg transition-all duration-300 text-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">GOALS / MATCH</span>
          <span className="text-2xl md:text-3xl font-black text-orange-500">{averageGoals}</span>
          <span className="text-[10px] text-slate-500 font-semibold mt-1">Average Ratio</span>
        </div>

      </div>
    </div>
  );
}
