const roster = {
    cards: [
        {
            heading: "Head Coach",
            icon: "icon-clipboard",
            items: [
                { label: "Erik Spoelstra", href: "coach.html" }
            ]
        },
        {
            heading: "Current Roster",
            icon: "icon-jersey",
            items: [
                { label: "Bam Adebayo (#13)", href: "player.html" }
            ]
        },
        {
            heading: "Schedule & Seasons",
            icon: "icon-calendar",
            items: [
                { label: "2025-2026 Season", href: "season.html" },
                { label: "Next Game: vs. Lakers", href: "game.html" }
            ]
        }
    ]
};
function get() {
    return roster;
}
export default { get };
