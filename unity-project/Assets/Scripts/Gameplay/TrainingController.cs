using UnityEngine;
using StreetGangs.Core;

namespace StreetGangs.Gameplay
{
    public class TrainingController : MonoBehaviour
    {
        public bool Train(string stat)
        {
            var player = GameState.Instance.Player;
            if (player.Stamina <= 0) return false;
            switch (stat)
            {
                case "Strength": player.Stats.Strength++; break;
                case "Speed": player.Stats.Speed++; break;
                case "Defense": player.Stats.Defense++; break;
                case "Accuracy": player.Stats.Accuracy++; break;
                default: return false;
            }
            player.Stamina--;
            return true;
        }
    }
}
