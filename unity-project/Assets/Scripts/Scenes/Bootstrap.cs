using UnityEngine;
using StreetGangs.Core;

namespace StreetGangs.Scenes
{
    public class Bootstrap : MonoBehaviour
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void CreateState()
        {
            var go = new GameObject("GameState");
            go.AddComponent<GameState>();
        }
    }
}
