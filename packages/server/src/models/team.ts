
export interface TeamCardItem {
    label: string;
    href: string;
}

export interface TeamCard {
    heading: string;
    icon: string;
    items: Array<TeamCardItem>;
}

export interface TeamRoster {
    cards: Array<TeamCard>;
}
