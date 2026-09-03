export default function SquadPlayerCard({ player }) {
  const { name, position, dateOfBirth, team } = player;

  const getAge = (dobString) => {
    if (!dobString) return 'N/A';
    const dob = new Date(dobString);
    const tournamentYear = 2026;
    return tournamentYear - dob.getFullYear();
  };

  // Color coding based on player positions (Light Theme)
  const getPositionStyles = (pos) => {
    const lowercasePos = pos?.toLowerCase() || '';
    if (lowercasePos.includes('goalkeeper')) {
      return {
        badgeBg: 'bg-cyan-50 border-cyan-200 text-cyan-600',
        glow: 'group-hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:border-cyan-400',
        avatarGrad: 'from-cyan-100 to-slate-50',
        avatarText: 'text-cyan-600'
      };
    }
    if (lowercasePos.includes('defence') || lowercasePos.includes('defender')) {
      return {
        badgeBg: 'bg-slate-100 border-slate-200 text-slate-600',
        glow: 'group-hover:shadow-[0_0_15px_rgba(100,116,139,0.08)] group-hover:border-slate-350',
        avatarGrad: 'from-slate-100 to-slate-50',
        avatarText: 'text-slate-600'
      };
    }
    if (lowercasePos.includes('midfield') || lowercasePos.includes('midfielder')) {
      return {
        badgeBg: 'bg-purple-50 border-purple-200 text-purple-600',
        glow: 'group-hover:shadow-[0_0_15px_rgba(168,85,247,0.08)] group-hover:border-purple-400',
        avatarGrad: 'from-purple-100 to-slate-50',
        avatarText: 'text-purple-600'
      };
    }
    // Offence / Forward
    return {
      badgeBg: 'bg-orange-50 border-orange-200 text-orange-600 font-extrabold',
      glow: 'group-hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] group-hover:border-orange-450',
      avatarGrad: 'from-orange-100 to-slate-50',
      avatarText: 'text-orange-600'
    };
  };

  const styles = getPositionStyles(position);
  const initials = name
    ? name.split(' ').slice(0, 2).map(n => n[0]).join('')
    : 'FP';

  return (
    <div className={`group relative overflow-hidden bg-white border border-slate-200 hover:border-orange-500/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${styles.glow}`}>
      
      {/* Top section: Avatar and Position Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${styles.avatarGrad} flex items-center justify-center border border-slate-100 shadow-inner`}>
          <span className={`text-sm font-black tracking-wider ${styles.avatarText}`}>
            {initials}
          </span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${styles.badgeBg}`}>
          {position || 'Player'}
        </span>
      </div>

      {/* Middle section: Player Name */}
      <div className="mb-4">
        <h4 className="text-base font-black text-slate-800 transition-colors leading-tight mb-1 truncate group-hover:text-orange-500">
          {name}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Age {getAge(dateOfBirth)}</span>
          <span>•</span>
          <span>DOB: {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
        </div>
      </div>

      {/* Bottom section: Team affiliation */}
      <div className="flex items-center gap-2.5 border-t border-slate-100 pt-3 mt-1">
        <div className="w-6 h-6 rounded bg-slate-50 border border-slate-150 p-0.5 flex items-center justify-center">
          <img src={team.crest} alt={team.name} className="w-full h-full object-contain" />
        </div>
        <span className="text-[11px] font-bold text-slate-500 truncate">
          {team.name}
        </span>
      </div>

    </div>
  );
}
