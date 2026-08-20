import React from 'react';
import { Users, Award, Zap, Trophy } from 'lucide-react';
import LevelProgressBar from '../gamification/LevelProgressBar';

export default function StudySquadDashboard({ squadData, onLeaveSquad, onRefresh }) {
  if (!squadData) return null;

  const { squad, members } = squadData;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-2xl p-6 flex justify-between items-center border border-slate-700 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-500" />
            {squad.name}
          </h1>
          <p className="text-slate-400 mt-2 font-mono">
            Invite Code: <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded">{squad.inviteCode}</span>
          </p>
        </div>
        <button 
          onClick={onLeaveSquad}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors text-sm font-semibold border border-red-500/20"
        >
          Leave Squad
        </button>
      </div>

      {/* Squad Progress */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Squad Weekly Goal
        </h2>
        <div className="mb-2 flex justify-between text-sm font-bold">
          <span className="text-indigo-400">Total XP: {squad.totalXp}</span>
          <span className="text-slate-400">Target: {squad.weeklyGoalXp}</span>
        </div>
        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(100, (squad.totalXp / squad.weeklyGoalXp) * 100)}%` }}
          />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-500" />
          Squad Leaderboard
        </h2>
        <div className="space-y-4">
          {members.sort((a, b) => b.user.xp - a.user.xp).map((member, idx) => (
            <div key={member.id} className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-2xl font-bold text-slate-500 w-8 text-center">
                #{idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-200">{member.user.name}</span>
                  <span className="font-bold text-indigo-400 flex items-center gap-1 text-sm">
                    {member.user.xp} XP
                  </span>
                </div>
                <LevelProgressBar xp={member.user.xp} level={member.user.level} nextLevelXP={member.user.level * 100} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
