using UnityEngine;

namespace StreetGangs.Core
{
    public class GameState : MonoBehaviour
    {
        public static GameState Instance { get; private set; }
        public PlayerProfile Player { get; private set; } = new PlayerProfile();

        private void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public void AddXP(int amount)
        {
            if (amount <= 0) return;
            Player.XP += amount;
            while (Player.XP >= XPRequired(Player.Level))
            {
                Player.XP -= XPRequired(Player.Level);
                Player.Level++;
                Player.Stamina++;
                Player.Energy = Player.MaxEnergy;
            }
        }

        public int XPRequired(int level) => Mathf.Max(100, level * 100);
    }
}
