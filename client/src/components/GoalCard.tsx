import type { Goal, Priority } from '../types/goal';

interface GoalCardProps {
  goal: Goal;
}

// Fonction pour gérer les couleurs des badges
const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'LOW':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Fonction pour formater la date proprement (ex: "20 janv. 2024")
const formatDate = (dateString: string) => {
  if (!dateString) return 'Pas de date';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function GoalCard({ goal }: GoalCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full">
      
      {/* --- EN-TÊTE : Titre et Badge --- */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-800 leading-tight">
          {goal.title}
        </h3>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${getPriorityColor(goal.priority)}`}>
          {goal.priority}
        </span>
      </div>

      {/* --- CORPS : Description (Optionnel) --- */}
      {goal.description && (
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {goal.description}
        </p>
      )}

      {/* --- PIED DE CARTE : Date et Catégorie --- */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          {/* Icône Calendrier SVG simple */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(goal.deadline || goal.startDate)}</span>
        </div>

        {goal.category && (
          <span className="uppercase tracking-wider font-medium text-gray-300">
            {goal.category}
          </span>
        )}
      </div>
    </div>
  );
}