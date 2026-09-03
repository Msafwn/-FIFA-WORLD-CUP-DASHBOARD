import { useState } from 'react';

export default function StandingTable({ standings }) {
  const [selectedGroup, setSelectedGroup] = useState(standings?.[0]?.group || 'Group A');

  if (!standings || standings.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500 font-medium">
        No standings data available.
      </div>
    );
  }

  const activeGroupData = standings.find(s => s.group === selectedGroup) || standings[0];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
      
      {/* Header and Group Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-150">
        <div>
          <h2 className="text-xl font-black text-slate-850 tracking-tight">World Cup Standings</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Group Stage Rankings</p>
        </div>
        
        {/* Selector Dropdown */}
        <div className="relative">
          <select 
            value={selectedGroup} 
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-48 bg-slate-50 border border-slate-200 text-slate-750 text-xs font-bold rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:border-orange-500/30 transition-colors"
          >
            {standings.map((groupObj, idx) => (
              <option key={idx} value={groupObj.group} className="bg-white text-slate-800 font-bold py-2">
                {groupObj.group}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
              <th className="py-3 px-2 text-center w-12">POS</th>
              <th className="py-3 px-3">TEAM</th>
              <th className="py-3 px-2 text-center w-16">PLAYED</th>
              <th className="py-3 px-2 text-center w-12 text-orange-600">W</th>
              <th className="py-3 px-2 text-center w-12 text-slate-700">D</th>
              <th className="py-3 px-2 text-center w-12 text-red-500">L</th>
              <th className="py-3 px-2 text-center w-16">GD</th>
              <th className="py-3 px-2 text-center w-16 font-black text-slate-800">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {activeGroupData.table.map((row, idx) => {
              const { position, team, playedGames, won, draw, lost, goalDifference, points } = row;
              
              // Top two qualify, let's highlight them
              const isQualified = position <= 2;

              return (
                <tr 
                  key={idx} 
                  className={`hover:bg-slate-50/50 transition-colors group ${
                    isQualified ? 'bg-orange-50/20' : ''
                  }`}
                >
                  {/* Position */}
                  <td className="py-4 px-2 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black ${
                      position === 1 
                        ? 'bg-orange-500 border border-orange-500 text-white' 
                        : position === 2
                          ? 'bg-slate-200 border border-slate-300 text-slate-750'
                          : 'bg-slate-50 border border-slate-150 text-slate-550'
                    }`}>
                      {position}
                    </span>
                  </td>

                  {/* Team Crest & Name */}
                  <td className="py-4 px-3 font-bold text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-150 p-1 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                        <img src={team.crest} alt={team.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="group-hover:text-orange-500 transition-colors">{team.name}</span>
                    </div>
                  </td>

                  {/* Played Games */}
                  <td className="py-4 px-2 text-center font-semibold text-slate-500">
                    {playedGames}
                  </td>

                  {/* Won */}
                  <td className="py-4 px-2 text-center font-bold text-orange-650">
                    {won}
                  </td>

                  {/* Draw */}
                  <td className="py-4 px-2 text-center font-bold text-slate-600">
                    {draw}
                  </td>

                  {/* Lost */}
                  <td className="py-4 px-2 text-center font-bold text-red-500">
                    {lost}
                  </td>

                  {/* GD */}
                  <td className={`py-4 px-2 text-center font-bold ${
                    goalDifference > 0 
                      ? 'text-orange-600' 
                      : goalDifference < 0 
                        ? 'text-red-500' 
                        : 'text-slate-500'
                  }`}>
                    {goalDifference > 0 ? `+${goalDifference}` : goalDifference}
                  </td>

                  {/* Points */}
                  <td className="py-4 px-2 text-center font-black text-slate-800 text-sm">
                    {points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Group stages notes */}
      <div className="mt-4 flex items-center gap-2 text-[10px] text-orange-700 font-bold uppercase bg-orange-50 border border-orange-100 p-2.5 rounded-xl w-fit">
        <span className="w-2.5 h-2.5 rounded bg-orange-500/20 border border-orange-500/30"></span>
        <span>Top 2 advance to the Knockout Stage</span>
      </div>

    </div>
  );
}
