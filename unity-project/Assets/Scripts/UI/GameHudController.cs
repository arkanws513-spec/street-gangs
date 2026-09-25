using UnityEngine;
using StreetGangs.Core;

namespace StreetGangs.UI
{
    public class GameHudController : MonoBehaviour
    {
        [SerializeField] private TMPro.TMP_Text levelText;
        [SerializeField] private TMPro.TMP_Text moneyText;
        [SerializeField] private TMPro.TMP_Text energyText;
        [SerializeField] private TMPro.TMP_Text staminaText;
        [SerializeField] private TMPro.TMP_Text cityText;
        [SerializeField] private UnityEngine.UI.Slider xpBar;

        private void Update()
        {
            var p = GameState.Instance.Player;
            if (levelText) levelText.text = $"المستوى {p.Level}";
            if (moneyText) moneyText.text = $"💰 {p.Money:N0}";
            if (energyText) energyText.text = $"⚡ {p.Energy}/{p.MaxEnergy}";
            if (staminaText) staminaText.text = $"💪 {p.Stamina}";
            if (cityText) cityText.text = p.CurrentCity;
            if (xpBar) { xpBar.maxValue = GameState.Instance.XPRequired(p.Level); xpBar.value = p.XP; }
        }
    }
}
