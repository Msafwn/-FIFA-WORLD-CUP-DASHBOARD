import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FavoriteTeamCard from './components/FavoriteTeamCard';
import TeamCard from './components/TeamCard';
import MatchCard from './components/MatchCard';
import PlayerCard from './components/PlayerCard';
import SquadPlayerCard from './components/SquadPlayerCard';
import StandingTable from './components/StandingTable';
import Pagination from './components/Pagination';

function App() {
  const [teams, setTeams] = useState([]);
  const [competitions, setCompetitions] = useState(null);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [scorers, setScorers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);
  
  // Navigation & Filtering States
  const [activeSection, setActiveSection] = useState('dashboard');
  const [teamSearch, setTeamSearch] = useState('');
  const [teamGroupFilter, setTeamGroupFilter] = useState('ALL');
  const [matchFilter, setMatchFilter] = useState('ALL');

  // Pagination States & Constants (Configured by Rows)
  const [teamPage, setTeamPage] = useState(1);
  const TEAMS_PER_PAGE = 8; // 2 rows (4 cols per row)

  const [matchPage, setMatchPage] = useState(1);
  const MATCHES_PER_PAGE = 9; // 3 rows (3 cols per row)

  const [scorerPage, setScorerPage] = useState(1);
  const SCORERS_PER_PAGE = 9; // 3 rows (3 cols per row)

  // Squad Players Filter & Pagination States
  const [playerTab, setPlayerTab] = useState('scorers'); // 'scorers' or 'squad'
  const [squadSearch, setSquadSearch] = useState('');
  const [squadPosition, setSquadPosition] = useState('ALL');
  const [squadTeam, setSquadTeam] = useState('ALL');
  const [squadPage, setSquadPage] = useState(1);
  const SQUAD_PER_PAGE = 12; // 3 rows (4 cols per row)

  const [isCached, setIsCached] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const computeStandingsFromMatches = (matchList) => {
    const groupMatches = (matchList || []).filter(m => m.stage === 'GROUP_STAGE' && m.group);
    const groupsMap = {};

    groupMatches.forEach(m => {
      const gName = m.group.replace('GROUP_', 'Group ');
      if (!groupsMap[gName]) groupsMap[gName] = {};

      [m.homeTeam, m.awayTeam].forEach(t => {
        if (!t || !t.id) return;
        if (!groupsMap[gName][t.id]) {
          groupsMap[gName][t.id] = {
            position: 1,
            team: { id: t.id, name: t.name, crest: t.crest, tla: t.tla },
            playedGames: 0,
            won: 0,
            draw: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0
          };
        }
      });

      if (m.status === 'FINISHED' && m.score?.fullTime) {
        const homeGoals = Number(m.score.fullTime.home) || 0;
        const awayGoals = Number(m.score.fullTime.away) || 0;
        const home = groupsMap[gName][m.homeTeam?.id];
        const away = groupsMap[gName][m.awayTeam?.id];
        if (home && away) {
          home.playedGames += 1;
          away.playedGames += 1;
          home.goalsFor += homeGoals;
          home.goalsAgainst += awayGoals;
          away.goalsFor += awayGoals;
          away.goalsAgainst += homeGoals;
          home.goalDifference = home.goalsFor - home.goalsAgainst;
          away.goalDifference = away.goalsFor - away.goalsAgainst;

          if (homeGoals > awayGoals) {
            home.won += 1;
            home.points += 3;
            away.lost += 1;
          } else if (homeGoals < awayGoals) {
            away.won += 1;
            away.points += 3;
            home.lost += 1;
          } else {
            home.draw += 1;
            away.draw += 1;
            home.points += 1;
            away.points += 1;
          }
        }
      }
    });

    return Object.entries(groupsMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([groupName, teamsObj]) => {
        const sortedTable = Object.values(teamsObj)
          .sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            return b.goalsFor - a.goalsFor;
          })
          .map((row, idx) => ({ ...row, position: idx + 1 }));
        return { group: groupName, table: sortedTable };
      });
  };

  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsSyncing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const CACHE_KEY = 'fifa_wc_data_cache_v1';
    const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache to prevent 429 rate limits

    if (!forceRefresh) {
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (Date.now() - cached.timestamp < CACHE_TTL && cached.teams?.length > 0) {
            setTeams(cached.teams || []);
            setCompetitions(cached.competitions || null);
            setMatches(cached.matches || []);
            setStandings(cached.standings || []);
            setScorers(cached.scorers || []);
            setLastUpdated(new Date(cached.timestamp));
            setIsCached(true);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("Cache reading error:", e);
      }
    }

    const headers = {
      "X-Auth-Token": "4ae031f92f634b6ea14005d157327ab3"
    };

    try {
      const endpoints = [
        { key: 'teams', url: "/api-football/v4/competitions/WC/teams" },
        { key: 'matches', url: "/api-football/v4/competitions/WC/matches" },
        { key: 'standings', url: "/api-football/v4/competitions/WC/standings" },
        { key: 'scorers', url: "/api-football/v4/competitions/WC/scorers" }
      ];

      const results = await Promise.allSettled(
        endpoints.map(ep =>
          fetch(ep.url, { headers }).then(async res => {
            if (res.status === 429) {
              throw new Error("Rate limit reached (10 requests/min on free tier).");
            }
            if (!res.ok) {
              if (res.status === 404 && ep.key === 'standings') {
                return { standings: [] };
              }
              throw new Error(`Failed to fetch ${ep.key} (${res.status})`);
            }
            return res.json();
          })
        )
      );

      const [teamsRes, matchesRes, standingsRes, scorersRes] = results;

      if (teamsRes.status === 'fulfilled' && matchesRes.status === 'fulfilled') {
        const fetchedTeams = teamsRes.value?.teams || [];
        const fetchedCompetitions = teamsRes.value || null;
        const fetchedMatches = matchesRes.value?.matches || [];
        let fetchedStandings = standingsRes.status === 'fulfilled' ? (standingsRes.value?.standings || []) : [];
        const fetchedScorers = scorersRes.status === 'fulfilled' ? (scorersRes.value?.scorers || []) : [];

        if (fetchedStandings.length === 0 && fetchedMatches.length > 0) {
          fetchedStandings = computeStandingsFromMatches(fetchedMatches);
        }

        setTeams(fetchedTeams);
        setCompetitions(fetchedCompetitions);
        setMatches(fetchedMatches);
        setStandings(fetchedStandings);
        setScorers(fetchedScorers);
        setLastUpdated(new Date());
        setIsCached(false);

        // Save to cache
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            teams: fetchedTeams,
            competitions: fetchedCompetitions,
            matches: fetchedMatches,
            standings: fetchedStandings,
            scorers: fetchedScorers
          }));
        } catch (e) {
          console.warn("Could not save to localStorage:", e);
        }
      } else {
        // If API call failed (e.g. 429), try loading existing cache
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          setTeams(cached.teams || []);
          setCompetitions(cached.competitions || null);
          setMatches(cached.matches || []);
          setStandings(cached.standings || []);
          setScorers(cached.scorers || []);
          setLastUpdated(new Date(cached.timestamp));
          setIsCached(true);
        } else {
          throw new Error("Live API rate limit reached. Please wait a moment and retry.");
        }
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load World Cup data from live API.");
    } finally {
      setIsSyncing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getTeamDetails = (teamId) => {
    if (!standings) return null;
    for (const group of standings) {
      const entry = group.table?.find(t => t.team.id === teamId);
      if (entry) {
        return {
          group: group.group.replace('Group ', ''),
          points: entry.points,
          played: entry.playedGames,
          rank: entry.position
        };
      }
    }
    return null;
  };

  // Group letters list for filtering
  const groupsList = standings.map(g => g.group.replace('Group ', ''));

  // Filtering Teams logic
  const filteredTeams = teams.filter(team => {
    const matchesQuery = team.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
                         (team.tla && team.tla.toLowerCase().includes(teamSearch.toLowerCase()));
    
    if (teamGroupFilter === 'ALL') return matchesQuery;
    const details = getTeamDetails(team.id);
    return matchesQuery && details?.group === teamGroupFilter;
  });

  // Teams Pagination
  const totalTeamPages = Math.ceil(filteredTeams.length / TEAMS_PER_PAGE) || 1;
  const paginatedTeams = filteredTeams.slice((teamPage - 1) * TEAMS_PER_PAGE, teamPage * TEAMS_PER_PAGE);

  // Filtering Matches logic
  const filteredMatches = matches.filter(match => {
    if (matchFilter === 'ALL') return true;
    if (matchFilter === 'FINISHED') return match.status === 'FINISHED';
    if (matchFilter === 'LIVE') return match.status === 'LIVE' || match.status === 'IN_PLAY';
    if (matchFilter === 'UPCOMING') return match.status === 'TIMED' || match.status === 'SCHEDULED';
    return true;
  });

  // Matches Pagination (3 rows x 3 cols = 9 per page)
  const totalMatchPages = Math.ceil(filteredMatches.length / MATCHES_PER_PAGE) || 1;
  const paginatedMatches = filteredMatches.slice((matchPage - 1) * MATCHES_PER_PAGE, matchPage * MATCHES_PER_PAGE);

  // Top Scorers Pagination (3 rows x 3 cols = 9 per page)
  const totalScorerPages = Math.ceil(scorers.length / SCORERS_PER_PAGE) || 1;
  const paginatedScorers = scorers.slice((scorerPage - 1) * SCORERS_PER_PAGE, scorerPage * SCORERS_PER_PAGE);

  // Extract all squad players dynamically from teams array
  const allPlayers = teams.reduce((acc, team) => {
    if (team.squad) {
      const teamPlayers = team.squad.map(p => ({
        ...p,
        team: {
          id: team.id,
          name: team.name,
          crest: team.crest
        }
      }));
      return [...acc, ...teamPlayers];
    }
    return acc;
  }, []);

  // Filtering Squad Players logic
  const filteredSquadPlayers = allPlayers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(squadSearch.toLowerCase());
    const matchesPosition = squadPosition === 'ALL' || p.position?.toLowerCase().includes(squadPosition.toLowerCase());
    const matchesTeam = squadTeam === 'ALL' || String(p.team?.id) === squadTeam;
    return matchesSearch && matchesPosition && matchesTeam;
  });

  // Squad Players Pagination (3 rows x 4 cols = 12 per page)
  const totalSquadPages = Math.ceil(filteredSquadPlayers.length / SQUAD_PER_PAGE) || 1;
  const paginatedSquadPlayers = filteredSquadPlayers.slice((squadPage - 1) * SQUAD_PER_PAGE, squadPage * SQUAD_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-500/20 selection:text-orange-900">
      
      {/* Navbar Component */}
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        
        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 text-sm font-semibold tracking-wide animate-pulse">
              Syncing live FIFA World Cup data...
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center max-w-md mx-auto my-12 shadow-sm shadow-red-100">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="font-extrabold mb-1">Data Fetch Failure</p>
            <p className="text-xs text-slate-500 mb-4">{error}</p>
            <button
              onClick={() => loadData(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition"
            >
              🔄 Retry Data Sync
            </button>
          </div>
        )}

        {/* Dynamic Section Rendering */}
        {!loading && !error && (
          <div className="animate-fadeIn">
            {/* Sync bar */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200/60 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isCached ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                <span className="font-semibold text-slate-500">
                  {isCached ? '⚡ Cached Snapshot' : '🟢 Live FIFA Data Connected'} 
                  {teams.length > 0 && ` (${teams.length} Teams · ${matches.length} Matches)`}
                </span>
              </div>
              <button
                onClick={() => loadData(true)}
                disabled={isSyncing}
                className={`flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-600 font-bold rounded-lg transition shadow-xs text-[11px] ${
                  isSyncing ? 'opacity-75 cursor-wait' : ''
                }`}
                title="Force refresh data from Football API"
              >
                <span className={isSyncing ? 'animate-spin inline-block' : ''}>🔄</span>
                {isSyncing ? 'Syncing Live Data...' : 'Refresh API Data'}
              </button>
            </div>
            
            {/* 1. DASHBOARD TAB */}
            {activeSection === 'dashboard' && (
              <div className="space-y-12">
                <HeroSection 
                  competition={competitions?.competition} 
                  season={competitions?.season} 
                  teamsCount={teams.length} 
                  matches={matches} 
                />

                {/* Highlighted Favorite Team Portugal */}
                <div>
                  <h3 className="text-xs font-black text-orange-500 tracking-widest uppercase mb-4 pl-1">
                    ★ FAVORITE NATION FEATURE
                  </h3>
                  <FavoriteTeamCard />
                </div>

                {/* Overview Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Standings Snippet */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-500 tracking-wider uppercase">Quick Standings</h4>
                      <button onClick={() => setActiveSection('standings')} className="text-xs text-orange-500 font-bold hover:underline">
                        View All Groups →
                      </button>
                    </div>
                    <StandingTable standings={standings.slice(0, 1)} />
                  </div>

                  {/* Top Scorers Snippet */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-500 tracking-wider uppercase">Top Scorers</h4>
                      <button onClick={() => setActiveSection('players')} className="text-xs text-orange-500 font-bold hover:underline">
                        View Leaderboard →
                      </button>
                    </div>
                    <div className="space-y-4">
                      {scorers.slice(0, 2).map((scorer, i) => (
                        <PlayerCard key={i} scorer={scorer} rank={i + 1} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. FAVORITE TEAM TAB */}
            {activeSection === 'favorite' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Favorite Team</h1>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Custom Highlighting</p>
                </div>
                <FavoriteTeamCard />
              </div>
            )}

            {/* 3. TEAMS TAB */}
            {activeSection === 'teams' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">World Cup Teams</h1>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Participating Nations</p>
                  </div>
                  
                  {/* Search and Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    <input 
                      type="text"
                      placeholder="Search country..."
                      value={teamSearch}
                      onChange={(e) => {
                        setTeamSearch(e.target.value);
                        setTeamPage(1);
                      }}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none w-48 shadow-sm"
                    />

                    <select
                      value={teamGroupFilter}
                      onChange={(e) => {
                        setTeamGroupFilter(e.target.value);
                        setTeamPage(1);
                      }}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:border-orange-500 shadow-sm"
                    >
                      <option value="ALL">All Groups</option>
                      {groupsList.map((g, i) => (
                        <option key={i} value={g}>Group {g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {filteredTeams.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {paginatedTeams.map((team) => (
                        <TeamCard key={team.id} team={team} details={getTeamDetails(team.id)} />
                      ))}
                    </div>

                    {/* Teams Pagination Component */}
                    <Pagination
                      currentPage={teamPage}
                      totalPages={totalTeamPages}
                      onPageChange={setTeamPage}
                      totalItems={filteredTeams.length}
                      itemsPerPage={TEAMS_PER_PAGE}
                      itemName="nations"
                    />
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-500 font-medium">
                    No teams found matching search criteria.
                  </div>
                )}
              </div>
            )}

            {/* 4. MATCHES TAB */}
            {activeSection === 'matches' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Tournament Matches</h1>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Fixtures and Results</p>
                  </div>

                  {/* Matches filter switcher */}
                  <div className="flex gap-2 bg-slate-200/50 p-1 rounded-xl border border-slate-200 w-fit">
                    {['ALL', 'FINISHED', 'LIVE', 'UPCOMING'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setMatchFilter(status);
                          setMatchPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider transition-all border ${
                          matchFilter === status
                            ? 'bg-orange-500 text-white border-orange-550 shadow-sm'
                            : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredMatches.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>

                    {/* Matches Pagination Component */}
                    <Pagination
                      currentPage={matchPage}
                      totalPages={totalMatchPages}
                      onPageChange={setMatchPage}
                      totalItems={filteredMatches.length}
                      itemsPerPage={MATCHES_PER_PAGE}
                      itemName="matches"
                    />
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-550 font-medium">
                    No matches found in this status category.
                  </div>
                )}
              </div>
            )}

            {/* 5. STANDINGS TAB */}
            {activeSection === 'standings' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Group Stage Standings</h1>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Live Tables</p>
                </div>
                <StandingTable standings={standings} />
              </div>
            )}

            {/* 6. PLAYERS TAB */}
            {activeSection === 'players' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">World Cup Players</h1>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Scorers & Team Squads</p>
                  </div>

                  {/* Sub-tab switcher */}
                  <div className="flex gap-2 bg-slate-200/50 p-1 rounded-xl border border-slate-200 w-fit">
                    <button
                      onClick={() => setPlayerTab('scorers')}
                      className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all border ${
                        playerTab === 'scorers'
                          ? 'bg-orange-500 text-white border-orange-550 shadow-sm'
                          : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Top Scorers
                    </button>
                    <button
                      onClick={() => setPlayerTab('squad')}
                      className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all border ${
                        playerTab === 'squad'
                          ? 'bg-orange-500 text-white border-orange-550 shadow-sm'
                          : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Search Squads
                    </button>
                  </div>
                </div>

                {playerTab === 'scorers' ? (
                  scorers.length > 0 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedScorers.map((scorer, i) => (
                          <PlayerCard key={i} scorer={scorer} rank={(scorerPage - 1) * SCORERS_PER_PAGE + i + 1} />
                        ))}
                      </div>

                      {totalScorerPages > 1 && (
                        <Pagination
                          currentPage={scorerPage}
                          totalPages={totalScorerPages}
                          onPageChange={setScorerPage}
                          totalItems={scorers.length}
                          itemsPerPage={SCORERS_PER_PAGE}
                          itemName="scorers"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-550 font-medium">
                      No scorer stats available.
                    </div>
                  )
                ) : (
                  <div className="space-y-6">
                    {/* Filter controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">Search Player Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Cristiano Ronaldo"
                          value={squadSearch}
                          onChange={(e) => {
                            setSquadSearch(e.target.value);
                            setSquadPage(1);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-orange-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">Filter by Position</label>
                        <select
                          value={squadPosition}
                          onChange={(e) => {
                            setSquadPosition(e.target.value);
                            setSquadPage(1);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:border-orange-500"
                        >
                          <option value="ALL">All Positions</option>
                          <option value="Goalkeeper">Goalkeepers</option>
                          <option value="Defence">Defenders</option>
                          <option value="Midfield">Midfielders</option>
                          <option value="Offence">Forwards / Attackers</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">Filter by Nation</label>
                        <select
                          value={squadTeam}
                          onChange={(e) => {
                            setSquadTeam(e.target.value);
                            setSquadPage(1);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:border-orange-500"
                        >
                          <option value="ALL">All Nations</option>
                          {teams.map((t) => (
                            <option key={t.id} value={String(t.id)}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {filteredSquadPlayers.length > 0 ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {paginatedSquadPlayers.map((player, i) => (
                            <SquadPlayerCard key={player.id || i} player={player} />
                          ))}
                        </div>

                        {/* Squad Players Pagination */}
                        <Pagination
                          currentPage={squadPage}
                          totalPages={totalSquadPages}
                          onPageChange={setSquadPage}
                          totalItems={filteredSquadPlayers.length}
                          itemsPerPage={SQUAD_PER_PAGE}
                          itemName="players"
                        />
                      </div>
                    ) : (
                      <div className="text-center py-20 text-slate-500 font-medium">
                        No squad players found matching search criteria.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-250 bg-white py-8 text-center text-slate-500 text-xs font-semibold">
        <p>© {new Date().getFullYear()} FIFA World Cup. Orange & White Premium Dashboard.</p>
      </footer>
    </div>
  );
}

export default App;
