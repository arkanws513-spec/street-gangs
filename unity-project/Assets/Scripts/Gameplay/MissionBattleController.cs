using System.Collections;
using UnityEngine;
using StreetGangs.Core;

namespace StreetGangs.Gameplay
{
    public class MissionBattleController : MonoBehaviour
    {
        public BattleState State { get; private set; }

        public void Begin(int opponentPower)
        {
            State = new BattleState();
            StartCoroutine(RunBattle(opponentPower));
        }

        private IEnumerator RunBattle(int opponentPower)
        {
            while (!State.Finished)
            {
                yield return new WaitForSeconds(0.55f);
                if (State.Turn == BattleSide.Player)
                {
                    int damage = Mathf.Clamp(GameState.Instance.Player.Stats.Strength + Random.Range(4, 13), 4, 35);
                    State.OpponentHealth = Mathf.Max(0, State.OpponentHealth - damage);
                    State.Turn = BattleSide.Opponent;
                }
                else
                {
                    int damage = Mathf.Clamp(opponentPower / 4 + Random.Range(3, 10), 3, 30);
                    damage = Mathf.Max(1, damage - GameState.Instance.Player.Stats.Defense / 8);
                    State.PlayerHealth = Mathf.Max(0, State.PlayerHealth - damage);
                    State.Turn = BattleSide.Player;
                }
                if (State.PlayerHealth == 0 || State.OpponentHealth == 0) State.Finished = true;
            }
        }
    }
}
