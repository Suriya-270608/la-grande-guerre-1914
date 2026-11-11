export interface WWISectionItem {
  name: string;
  subtitle: string;
  description: string;
  photoUrl?: string;
  badge?: string;
  frenchPhrase?: string;
}

export interface WWIBook {
  id: string;
  volumeNumber: string; // e.g. "BOOK I"
  romanNumeral: string; // e.g. "I"
  title: string;
  frenchTitle: string;
  subtitle: string;
  categoryTab: string;
  metaBadge: string;
  synopsis: string;
  quote: string;
  quoteTranslation?: string;
  keyFacts: string[];
  sections: WWISectionItem[];
  themeColor: string;
  coverPhotoUrl: string;
  coverPhotoCaption: string;
}

export const WWI_BOOKS: WWIBook[] = [
  {
    id: 'introduction',
    volumeNumber: 'BOOK I',
    romanNumeral: 'I',
    title: 'General Introduction: France in WWI',
    frenchTitle: 'L’Appel de la Patrie & L’Union Sacrée',
    subtitle: 'The Outbreak, National Mobilization & Homeland Defense',
    categoryTab: '1. INTRODUCTION · LA PATRIE',
    metaBadge: '1914–1918 / L’APPEL DE LA PATRIE / 8.4M MOBILISÉS',
    synopsis: 'When war broke out in August 1914, France faced an existential threat along its northeastern border. Over the next four years, France became the central theater of the Western Front. A total of 8.4 million French citizens answered the call of « La Patrie » (The Homeland)—over 20% of the entire national population. From the historic truce of the « Union Sacrée » (Sacred Union) to 450 miles of unbroken frontline trenches, French troops held the line to defend their Republic.',
    quote: '« Pas une défaillance, pas une faiblesse. La France sera héroïquement défendue par tous ses fils, dont rien ne brisera l’Union Sacrée. »',
    quoteTranslation: '“Not a single failure, not a single weakness. France will be heroically defended by all her sons, whose Sacred Union nothing will break.” — President Raymond Poincaré, Message aux Chambres, August 4, 1914.',
    keyFacts: [
      '8,410,000 French citizens mobilized under the « Ordre de Mobilisation Générale »',
      '450 miles (720 km) of frontline defended from the Mer du Nord (North Sea) to Switzerland',
      '4,278 military trains dispatched 3.8 million men in the first 17 days of war',
      'French factories manufactured over 50,000 aircraft and 3,500 tanks to supply Allied armies'
    ],
    sections: [
      {
        name: 'The Outbreak of War · « L’Ordre de Mobilisation Générale »',
        subtitle: 'August 1914 · Shouts of « Pour la France ! » across all 36,000 communes',
        description: 'On August 1, 1914, church bells sounded the tocsin across every village in France. Posters of the « Ordre de Mobilisation Générale » were pasted on town halls. Within days, millions of citizens reported to military depots, boarding trains with flowers in their rifles and shouts of « Vive la France ! »',
        photoUrl: '/assets/ww1/book1_opt.jpg',
        frenchPhrase: '« Pour la France et pour la République ! »',
      },
      {
        name: 'The Sacred Union · « L’Union Sacrée »',
        subtitle: 'National Unity in the Face of Danger · Political Truce',
        description: 'Factions that had fought bitterly for decades—socialists, royalists, republicans, Catholics, and trade unionists—proclaimed « L’Union Sacrée ». Leaders like René Viviani and Léon Jouhaux joined hands to safeguard the territorial integrity of the nation.',
        frenchPhrase: '« L’Union Sacrée devant l’ennemi »',
      },
      {
        name: 'The 450-Mile Western Front · « Le Front de l’Ouest »',
        subtitle: 'The Battlefield of Europe · De la Mer du Nord aux Vosges',
        description: 'Following the initial war of movement, the armies dug into the earth. The Western Front in France became an unbroken subterranean network of trenches, barbed wire, and artillery redoubts that defined the European conflict.',
        frenchPhrase: '« Les tranchées de première ligne »',
      },
    ],
    themeColor: '#1F3FB0',
    coverPhotoUrl: '/assets/ww1/book1_opt.jpg',
    coverPhotoCaption: 'Official « Ordre de Mobilisation Générale » poster displayed throughout France on August 2, 1914.',
  },
  {
    id: 'battles',
    volumeNumber: 'BOOK II',
    romanNumeral: 'II',
    title: 'Key Battles: Origins & Battlegrounds',
    frenchTitle: 'Les Grandes Batailles : De la Marne à Verdun',
    subtitle: 'The Marne, Verdun, the Somme & The Second Marne',
    categoryTab: '2. BATAILLES · VERDUN & MARNE',
    metaBadge: '1914–1918 / LES GRANDES BATAILLES / « ON LES AURA ! »',
    synopsis: 'France’s survival hinged on four epic engagements. At the Marne in September 1914, General Gallieni rushed troops in Paris taxicabs (« Les Taxis de la Marne ») to halt the German advance. At Verdun in 1916, French soldiers held the line for 300 days through 53 million artillery shells, immortalizing General Pétain’s rallying order: « Courage ! On les aura ! » and the famous vow: « Ils ne passeront pas ! » (They shall not pass).',
    quote: '« Courage ! On les aura ! » — Général Philippe Pétain, Ordre Général No. 50 (Verdun, 10 Avril 1916). Battlefield cry: « Ils ne passeront pas ! »',
    quoteTranslation: '“Courage! We will have them! — They shall not pass!”',
    keyFacts: [
      'Battle of the Marne (Sept 1914): 600 Parisian taxicabs (« Les Taxis de la Marne ») rushed 6,000 reserve infantrymen to save Paris',
      'Battle of Verdun (Feb–Dec 1916): 300 days of relentless fire along « La Voie Sacrée »; 70% of the entire French Army rotated through its defense',
      '53,000,000 artillery shells fired across the hills and forts of Verdun alone',
      'Second Battle of the Marne (July 1918): Decisive surprise attack with 480 Renault FT tanks initiated the victorious Hundred Days drive'
    ],
    sections: [
      {
        name: 'First Battle of the Marne · « Le Miracle de la Marne » (1914)',
        subtitle: 'Why: German armies 25 miles from Paris | Place: River Marne & Ourcq',
        description: 'General Joffre and Paris Military Governor Gallieni struck the exposed German flank. Six hundred Parisian taxis carried reinforcements to the battlefield. Paris was saved, shattering the Schlieffen Plan.',
        frenchPhrase: '« Les Taxis de la Marne et le salut de Paris »',
      },
      {
        name: 'Battle of Verdun · « L’Enfer de Verdun » (1916)',
        subtitle: 'Why: German strategy to bleed France | Place: Meuse & Forts Douaumont & Vaux',
        description: 'The longest battle in military history. General Pétain maintained the lifeline road « La Voie Sacrée » (The Sacred Way), carrying 50,000 tons of supplies weekly. Under the cry « Ils ne passeront pas ! », French soldiers held and recaptured the lost forts.',
        photoUrl: '/assets/ww1/book2_opt.jpg',
        frenchPhrase: '« Ils ne passeront pas ! On les aura ! »',
      },
      {
        name: 'Battle of the Somme · « La Bataille de la Somme » (1916)',
        subtitle: 'Why: Relieve pressure on Verdun | Place: Picardy & River Somme',
        description: 'A joint Franco-British offensive featuring synchronized creeping artillery barrages (« Tir de barrage roulant »). French assault divisions achieved the deepest tactical penetrations along the river line.',
        frenchPhrase: '« Le barrage d’artillerie roulant »',
      },
      {
        name: 'Second Battle of the Marne & Villers-Cotterêts (1918)',
        subtitle: 'Why: Halt the final German drive | Place: Villers-Cotterêts & The Marne',
        description: 'General Charles Mangin and Supreme Commander Ferdinand Foch ordered a sudden counter-strike with 480 Renault light tanks and fighter squadrons, shouting « En avant ! » to throw the German armies into retreat.',
        frenchPhrase: '« En avant ! La Victoire nous appelle ! »',
      },
    ],
    themeColor: '#8B1E1E',
    coverPhotoUrl: '/assets/ww1/book2_opt.jpg',
    coverPhotoCaption: 'French infantrymen firing from frontline trenches during the heroic defense of Verdun, 1916.',
  },
  {
    id: 'people',
    volumeNumber: 'BOOK III',
    romanNumeral: 'III',
    title: 'Important Figures & Their Roles',
    frenchTitle: 'Les Grands Hommes & Les Héroïques Poilus',
    subtitle: 'Clemenceau, Foch, Joffre, Gallieni, Poilus & Munitionnettes',
    categoryTab: '3. FIGURES & LES POILUS',
    metaBadge: 'LEADERSHIP / CLEMENCEAU, FOCH, JOFFRE & POILUS',
    synopsis: 'France’s defense was forged by legendary figures whose leadership proved decisive. Prime Minister Georges Clemenceau (« Le Tigre ») commanded total national resolve with his unbending motto: « Je fais la guerre ! » Military commanders like Joffre and Foch synchronized Allied armies. But the true heart of France were the ordinary frontline soldiers—« Les Poilus »—and the 400,000 women (« Les Munitionnettes ») who forged the munitions of victory in home factories.',
    quote: '« Politique intérieure : je fais la guerre. Politique extérieure : je fais la guerre. Toujours la guerre ! » — Georges Clemenceau, « Le Tigre » (Discours à la Chambre, 8 Mars 1918)',
    quoteTranslation: '“Domestic policy: I make war. Foreign policy: I make war. Always the war!”',
    keyFacts: [
      'Georges Clemenceau (« Le Tigre ») took leadership at age 76, visiting front-line trenches under shellfire to cheer the soldiers',
      'Maréchal Ferdinand Foch was named Supreme Allied Commander in 1918, proclaiming: « Mon centre cède, ma droite recule, situation excellente, j’attaque ! »',
      'Maréchal Joseph Joffre (« Le Père Joffre ») calmly rallied the armies on the Marne, saving the Republic in 1914',
      '400,000 French women (« Les Munitionnettes ») manufactured 200,000 artillery shells per day to sustain the army'
    ],
    sections: [
      {
        name: 'Georges Clemenceau · « Le Tigre » (1841–1929)',
        subtitle: 'Président du Conseil · « Le Père la Victoire »',
        description: 'Assumed leadership in November 1917 during France’s darkest hour. With fiery speeches and absolute resolve, he eradicated defeatism, stood with frontline troops in the mud, and directed the nation to final triumph.',
        photoUrl: '/assets/ww1/book3_opt.jpg',
        frenchPhrase: '« Je fais la guerre ! La victoire est au bout de l’effort ! »',
      },
      {
        name: 'Maréchal Ferdinand Foch (1851–1929)',
        subtitle: 'Commandant Suprême des Armées Alliées & Maréchal de France',
        description: 'Appointed Supreme Allied Commander at the Doullens Conference in March 1918. He unified American, British, and French divisions into one relentless offensive fist during the victorious Hundred Days campaign.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Maarschalk_Ferdinand_Foch_%281851-1929%29%2C_Bestanddeelnr_158-1095_%28cropped%29.jpg',
        frenchPhrase: '« Mon centre cède, ma droite recule, situation excellente, j’attaque ! »',
      },
      {
        name: 'Maréchal Joseph Joffre · « Le Père Joffre » (1852–1931)',
        subtitle: 'Commandant en Chef des Armées Françaises (1914–1916)',
        description: 'Known for his imperturbable calm during the catastrophic initial retreat. On September 5, 1914, he issued the immortal order: « Une troupe qui ne peut plus avancer devra se faire tuer sur place plutôt que de reculer. »',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Portrait_de_Joseph_Joffre_%28cropped%29%28b%29.jpg',
        frenchPhrase: '« Mourir sur place plutôt que de céder un pouce de notre sol »',
      },
      {
        name: 'Les Poilus · The Front-Line Infantrymen',
        subtitle: 'The Bearded Soldiers in Horizon-Blue Coats · « Debout les morts ! »',
        description: 'Over 8 million ordinary French citizens who endured rats, freezing mud, poison gas, and incessant artillery barrages. Their bravery spawned legendary rallying cries like « Debout les morts ! » (Stand up, you dead!).',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/FrenchTrenchWWI--nsillustratedwar03londuoft.jpeg',
        frenchPhrase: '« Debout les morts ! Vive la France ! »',
      },
      {
        name: 'Les Munitionnettes · Women of the War Factories',
        subtitle: 'The Heroines of the Home Front · « Les Ouvrières de la Victoire »',
        description: 'Over 400,000 French women worked 12-hour shifts in armaments factories, handling molten brass and toxic cordite to supply 200,000 artillery shells daily, ensuring the front never ran out of ammunition.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Women_shell_workers_Royal_Arsenal_WWI_AWM_H08115.jpeg',
        frenchPhrase: '« Les femmes de France au service de la Patrie »',
      },
    ],
    themeColor: '#1A2C42',
    coverPhotoUrl: '/assets/ww1/book3_opt.jpg',
    coverPhotoCaption: 'Georges Clemenceau, Prime Minister of France (« Le Tigre »), who led France to victory in 1918.',
  },
  {
    id: 'weapons',
    volumeNumber: 'BOOK IV',
    romanNumeral: 'IV',
    title: 'Weapons, Strategy, Tanks & Machines',
    frenchTitle: 'Les Armes, Chars d’Assaut & Stratégies',
    subtitle: 'The Renault FT Tank, Canon de 75, Aircraft & Trench Warfare',
    categoryTab: '4. ARMES & CHARS D’ASSAUT',
    metaBadge: 'TECHNOLOGY / RENAULT FT TANKS / CANON DE 75',
    synopsis: 'World War I spurred the greatest military technological revolution in French history. French engineers created the revolutionary Renault FT light tank (« Le Char de la Victoire »)—the blueprint for every modern tank in history—perfected the legendary rapid-fire « Canon de 75 », mastered fighter aviation with aces like Georges Guynemer, and perfected the scientific creeping artillery barrage (« Le Barrage Roulant »).',
    quote: '« La victoire appartient à celui qui sait maintenir le fer et le feu au plus haut degré. Nos chars légers sont le bouclier et l’épée de l’infanterie. » — Général Jean-Baptiste Estienne, « Le Père des Chars » (1918)',
    quoteTranslation: '“Victory belongs to the one who knows how to sustain iron and fire to the highest degree. Our light tanks are the shield and sword of the infantry.”',
    keyFacts: [
      'The Renault FT light tank (« Le Char de la Victoire ») was the first tank in history featuring a 360-degree rotating turret, rear engine, and driver controls',
      'The « Canon de 75 mm modèle 1897 » (« Notre Glorieux 75 ») could fire 15 to 20 rounds per minute without releveling due to its hydro-pneumatic recoil piston',
      'France manufactured over 52,000 combat aircraft—more than any other fighting nation—fielding the SPAD S.XIII and Nieuport fighters',
      'The Model 1915 « Casque Adrian » steel helmet reduced shrapnel head trauma by over 70%'
    ],
    sections: [
      {
        name: 'The Renault FT Light Tank · « Le Char de la Victoire »',
        subtitle: 'The World’s First Modern Tank · Designed by Louis Renault & General Estienne',
        description: 'Engineered in Boulogne-Billancourt, the Renault FT introduced the classic layout still used in modern armored warfare: an articulated revolving turret on top, crew in front, engine in rear. In 1918, over 3,000 units breached German defensive lines.',
        photoUrl: '/assets/ww1/book4_opt.jpg',
        frenchPhrase: '« Le Char de la Victoire · Révolution Blindée »',
      },
      {
        name: 'The Canon de 75 mm Mle 1897 · « Notre Glorieux 75 »',
        subtitle: 'The Rapid-Fire Artillery Legend · 20 Rounds per Minute',
        description: 'The supreme artillery piece of the war. Its hydro-pneumatic recoil mechanism allowed gunners to fire continuously without re-aiming, devastating attacking infantry and proving indispensable at the Marne and Verdun.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/54/0_Canon_de_75_mm_mod%C3%A8le_1897_-_Mus%C3%A9e_de_l%27arm%C3%A9e_%C3%A0_Paris_2.JPG',
        frenchPhrase: '« Notre Glorieux 75 · La foudre républicaine »',
      },
      {
        name: 'Aviation & Fighter Aces · « Les As du Ciel »',
        subtitle: 'Georges Guynemer (« Faire Face ! ») & René Fonck',
        description: 'France created the world’s premier fighter aviation corps. SPAD XIII and Nieuport biplanes ruled the air. Legendary ace Georges Guynemer became a national hero with his personal motto: « Faire Face ! » (Face up to the challenge!).',
        frenchPhrase: '« Faire Face ! · La gloire des ailes françaises »',
      },
      {
        name: 'Trench Strategy · « Le Barrage Roulant »',
        subtitle: 'Scientific Creeping Barrage & Defensive Tactics',
        description: 'French artillery officers pioneered the « barrage roulant »—a walking wall of bursting artillery fire advancing 100 meters every three minutes, protecting advancing Poilus as they captured enemy positions.',
        frenchPhrase: '« Le tir de barrage roulant protecteur »',
      },
    ],
    themeColor: '#3B4D3C',
    coverPhotoUrl: '/assets/ww1/book4_opt.jpg',
    coverPhotoCaption: 'The French Renault FT light tank (« Le Char de la Victoire »), revolutionary ancestor of all modern tanks.',
  },
  {
    id: 'conclusion',
    volumeNumber: 'BOOK V',
    romanNumeral: 'V',
    title: 'Conclusion & The Lasting Legacy',
    frenchTitle: 'L’Armistice, Le Devoir de Mémoire & La Flamme',
    subtitle: 'The Armistice of 1918, The Human Cost & Remembrance',
    categoryTab: '5. ARMISTICE & MÉMOIRE',
    metaBadge: '1918 / L’ARMISTICE / LE DEVOIR DE MÉMOIRE',
    synopsis: 'On November 11, 1918, at 5:15 AM in Marshal Foch’s railway carriage in the Compiègne Forest (« La Clairière de Rethondes »), Germany signed the Armistice. At 11:00 AM, bugles sounded the ceasefire (« Le Cessez-le-feu ») and church bells peeled across France. France was victorious and regained Alsace-Lorraine, but suffered 1,400,000 dead and 4,200,000 wounded. The nation vowed « Le Devoir de Mémoire » (The Duty of Remembrance), consecrated by the Tomb of the Unknown Soldier beneath the Arc de Triomphe.',
    quote: '« La France, hier soldat de Dieu, aujourd’hui soldat de l’Humanité, sera toujours le soldat de l’Idéal. Honneur à nos grands morts qui ont fait cette victoire ! » — Georges Clemenceau, Discours à la Chambre des Députés, 11 Novembre 1918',
    quoteTranslation: '“France, yesterday soldier of God, today soldier of Humanity, will always be the soldier of the Ideal. Honor to our great dead who achieved this victory!”',
    keyFacts: [
      '1,400,000 French military deaths (« Morts pour la France »), representing 27% of all French men aged 18 to 27',
      '4,200,000 wounded veterans, including over 300,000 severely disfigured soldiers known as « Les Gueules Cassées »',
      'The Armistice was signed in carriage 2419D in the clearing of Rethondes in the Compiègne Forest',
      'In 1920, « Le Soldat Inconnu » was laid to rest under the Arc de Triomphe, where « La Flamme du Souvenir » burns permanently'
    ],
    sections: [
      {
        name: 'The Armistice of November 11, 1918 · « L’Armistice »',
        subtitle: '11:00 AM · Bugles sound « Cessez-le-Feu ! » across the Western Front',
        description: 'In the forest clearing of Rethondes, Marshal Foch dictated the Allied terms. At the eleventh hour of the eleventh day of the eleventh month, all firing ceased. Troops emerged from trenches in disbelief as shouts of « La Victoire ! » echoed along the front.',
        photoUrl: '/assets/ww1/book5_opt.jpg',
        frenchPhrase: '« Cessez-le-feu ! La Victoire est à nous ! »',
      },
      {
        name: 'The Human Sacrifice · « Le Sacrifice de la Patrie »',
        subtitle: '1,400,000 Morts pour la France & « Les Gueules Cassées »',
        description: 'An entire generation of young Frenchmen gave their lives. Nearly 600,000 widows and 700,000 orphans were left behind. Severely disfigured veterans formed the association of « Les Gueules Cassées » (The Broken Faces) to demand dignity and peace.',
        frenchPhrase: '« Morts pour la France · Ils ont payé de leur sang »',
      },
      {
        name: 'The Tomb of the Unknown Soldier · « Le Soldat Inconnu »',
        subtitle: 'Arc de Triomphe, Paris · « La Flamme du Souvenir »',
        description: 'On November 11, 1920, an unidentified French infantryman chosen from the battlefield was interred beneath the Arc de Triomphe. Since 1923, an eternal flame (« La Flamme de la Nation ») has been rekindled every single evening at 6:30 PM.',
        frenchPhrase: '« Ici repose un soldat français mort pour la Patrie »',
      },
      {
        name: 'Duty of Remembrance · « Le Devoir de Mémoire »',
        subtitle: '« Ne Jamais Oublier » · Monuments aux Morts across all 36,000 Communes',
        description: 'Every city and village in France built a « Monument aux Morts » etched with the names of its fallen sons, establishing an unbroken national vow: « Ne Jamais Oublier » (Never Forget).',
        frenchPhrase: '« Ne Jamais Oublier · Honneur et Patrie »',
      },
    ],
    themeColor: '#203A43',
    coverPhotoUrl: '/assets/ww1/book5_opt.jpg',
    coverPhotoCaption: 'Marshal Ferdinand Foch and Allied officers outside the Armistice railway carriage in Compiègne, November 11, 1918.',
  },
  {
    id: 'entire-story',
    volumeNumber: 'BOOK VI',
    romanNumeral: 'VI',
    title: 'The Entire Story: France in WWI',
    frenchTitle: 'L’Histoire Complète en 5 Minutes (1914–1918)',
    subtitle: 'A 5-Minute Master Summary from 1914 to 1918',
    categoryTab: '6. L’HISTOIRE EN 5 MIN',
    metaBadge: '1914–1918 / L’HISTOIRE COMPLÈTE / ~5-MIN READ',
    synopsis: 'In August 1914, 8.4 million Frenchmen rallied to the defense of « La Patrie ». Over 1,560 days, France bore the heaviest burden of the Western Front. From the miraculous salvation of Paris at the Marne in 1914, through the blood-soaked crucible of Verdun in 1916 (« Ils ne passeront pas ! »), to Georges Clemenceau’s iron leadership in 1917 (« Je fais la guerre ! ») and Marshal Foch’s 1918 combined-arms armored offensive that forced the Armistice. This 5-minute volume condenses the entire epic chronology into five essential reading minutes.',
    quote: '« Honneur à nos grands morts qui ont fait cette victoire ! Grâce à eux, la France peut être libre. » — Georges Clemenceau, Discours à l’Assemblée Nationale (11 Novembre 1918)',
    quoteTranslation: '“Honor to our great dead who achieved this victory! Thanks to them, France can stand free.”',
    keyFacts: [
      'Reading time: Exactly 4 to 5 minutes covering the entire 1914–1918 war chronology',
      '1,560 days of war: From August 3, 1914 to the November 11, 1918 ceasefire',
      '8,410,000 citizens mobilized under the tricolor flag of the French Republic',
      '3 decisive turning points: 1914 Marne (halted the invasion), 1916 Verdun (broke the offensive), 1918 Marne (won the war)',
      '1,400,000 fallen heroes (« Morts pour la France ») honored forever under the Arc de Triomphe'
    ],
    sections: [
      {
        name: 'Minute 1: L’Invasion & Le Miracle de la Marne (1914)',
        subtitle: '00:00–01:00 min · « En avant, coûte que coûte ! » · Saving Paris',
        description: 'August 1914: Church bells sound mobilization across France. German armies sweep through Belgium toward Paris. General Joffre and Paris Governor Gallieni strike back at the River Marne using 600 Parisian taxicabs to rush reserve troops. The German advance is stopped 25 miles from Paris, shattering the Schlieffen Plan.',
        photoUrl: '/assets/ww1/book1_opt.jpg',
        frenchPhrase: '« Les Taxis de la Marne et le salut de la République »',
      },
      {
        name: 'Minute 2: L’Enfer des Tranchées & La Mobilisation (1915)',
        subtitle: '01:00–02:00 min · « Tiens bon ! » · 450 Miles of Wire & Steel',
        description: 'Both armies dig into the earth from the English Channel to Switzerland. Open maneuver ends; massive artillery rules the battlefield. In rear factories, 400,000 French women (« Les Munitionnettes ») forge 200,000 shells daily, while French soldiers (« Les Poilus ») endure mud, rats, poison gas, and artillery barrages in the trenches.',
        frenchPhrase: '« Tiens bon, Poilu ! La Patrie veille sur toi ! »',
      },
      {
        name: 'Minute 3: Le Brasier de Verdun & La Somme (1916)',
        subtitle: '02:00–03:00 min · « On les aura ! » · « Ils ne passeront pas ! »',
        description: 'February 1916: Germany unleashes 1,200 heavy cannons against Verdun to bleed France white. General Pétain organizes « La Voie Sacrée » (The Sacred Way). For 10 months, 70% of the French army rotates through Verdun, holding firm against 53 million shells before recapturing all lost forts.',
        photoUrl: '/assets/ww1/book6_opt.jpg',
        frenchPhrase: '« Courage ! On les aura ! Ils ne passeront pas ! »',
      },
      {
        name: 'Minute 4: L’Année Trouble 1917 & Le Tigre',
        subtitle: '03:00–04:00 min · « Je fais la guerre ! » · Rebuilding Morale',
        description: 'Spring 1917: The costly Chemin des Dames offensive triggers widespread infantry discipline strikes. Pétain halts suicidal frontal attacks and restores trust. In November 1917, 76-year-old Georges Clemenceau (« Le Tigre ») becomes Prime Minister, declaring: « Politique intérieure, je fais la guerre ! Politique extérieure, je fais la guerre ! »',
        photoUrl: '/assets/ww1/book3_opt.jpg',
        frenchPhrase: '« Je fais la guerre ! Toujours la guerre ! »',
      },
      {
        name: 'Minute 5: L’Offensive de la Victoire & Le 11 Novembre (1918)',
        subtitle: '04:00–05:00 min · « Victoire ! Cessez-le-feu ! » · Armistice',
        description: 'July 1918: Marshal Ferdinand Foch leads the Allied counter-offensive at the Second Battle of the Marne with 480 nimble Renault FT light tanks. The German armies break. On November 11, 1918 at 11:00 AM in the Compiègne Forest railway carriage, the ceasefire sounds. France regains Alsace-Lorraine, mourning 1.4 million fallen.',
        photoUrl: '/assets/ww1/book5_opt.jpg',
        frenchPhrase: '« Cessez-le-feu ! Vive la France libre et victorieuse ! »',
      },
    ],
    themeColor: '#12284C',
    coverPhotoUrl: '/assets/ww1/book6_opt.jpg',
    coverPhotoCaption: 'French infantrymen in the trenches of the Western Front defending the nation during the Great War (1914–1918).',
  },
];

export const CATEGORY_TABS = [
  { label: '1. INTRODUCTION · LA PATRIE', bookIndex: 0 },
  { label: '2. BATAILLES · VERDUN & MARNE', bookIndex: 1 },
  { label: '3. FIGURES & LES POILUS', bookIndex: 2 },
  { label: '4. ARMES & CHARS D’ASSAUT', bookIndex: 3 },
  { label: '5. ARMISTICE & MÉMOIRE', bookIndex: 4 },
  { label: '6. L’HISTOIRE EN 5 MIN', bookIndex: 5 },
];

/**
 * Generates bespoke SVG Cover for each of the 5 books
 */
export function generateCoverSvgDataUrl(book: WWIBook): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 474 900" width="474" height="900">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F7F4EC" />
      <stop offset="50%" stop-color="#ECE7DC" />
      <stop offset="100%" stop-color="#DFD9CB" />
    </linearGradient>
    <pattern id="grain" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="40" height="40" fill="transparent" />
      <circle cx="10" cy="10" r="0.8" fill="#141414" opacity="0.08" />
      <circle cx="30" cy="25" r="0.6" fill="#141414" opacity="0.06" />
      <circle cx="20" cy="35" r="0.7" fill="#141414" opacity="0.07" />
    </pattern>
    <clipPath id="photoClip">
      <rect x="0" y="0" width="340" height="290" rx="3" />
    </clipPath>
  </defs>

  <!-- Background with aged paper gradient and subtle grain -->
  <rect width="474" height="900" fill="url(#bgGrad)" />
  <rect width="474" height="900" fill="url(#grain)" />

  <!-- Outer Double Archival Border -->
  <rect x="18" y="18" width="438" height="864" fill="none" stroke="#141414" stroke-width="1.8" />
  <rect x="24" y="24" width="426" height="852" fill="none" stroke="#141414" stroke-width="0.8" stroke-dasharray="4 2" />

  <!-- Corner Ornaments -->
  <g stroke="#141414" stroke-width="1.2" fill="none">
    <path d="M18 36 L36 36 L36 18" />
    <path d="M456 36 L438 36 L438 18" />
    <path d="M18 864 L36 864 L36 882" />
    <path d="M456 864 L438 864 L438 882" />
  </g>

  <!-- Top Header Banner -->
  <g transform="translate(237, 65)" text-anchor="middle">
    <text font-family="'Inter Tight', sans-serif" font-weight="600" font-size="11" letter-spacing="0.22em" fill="#141414">
      RÉPUBLIQUE FRANÇAISE · ARCHIVES DE GUERRE
    </text>
    <text y="16" font-family="'Inter Tight', sans-serif" font-weight="500" font-size="8.5" letter-spacing="0.18em" fill="#6D6A63">
      OFFICIAL SIX-VOLUME HISTORICAL RECORD (1914–1918)
    </text>
    <line x1="-130" y1="26" x2="130" y2="26" stroke="#141414" stroke-width="0.8" />
    <circle cx="0" cy="26" r="3" fill="#1F3FB0" />
  </g>

  <!-- Volume Badge -->
  <g transform="translate(237, 126)" text-anchor="middle">
    <rect x="-105" y="-13" width="210" height="23" fill="none" stroke="#1F3FB0" stroke-width="1.2" />
    <text y="2" font-family="'Inter Tight', sans-serif" font-weight="600" font-size="10" letter-spacing="0.2em" fill="#1F3FB0">
      ${book.volumeNumber} · VOLUME ${book.romanNumeral}
    </text>
  </g>

  <!-- Book Title -->
  <g transform="translate(237, 185)" text-anchor="middle">
    <text font-family="'Newsreader', serif" font-weight="400" font-size="28" letter-spacing="-0.02em" fill="#141414">
      ${escapeXml(book.title.split(':')[0])}
    </text>
    <text y="26" font-family="'Newsreader', serif" font-style="italic" font-weight="400" font-size="17" fill="#1F3FB0">
      « ${escapeXml(book.frenchTitle)} »
    </text>
    <text y="50" font-family="'Inter Tight', sans-serif" font-weight="500" font-size="9" letter-spacing="0.08em" fill="#6D6A63">
      ${escapeXml(book.subtitle)}
    </text>
  </g>

  <!-- Central Real Historical Photo Framing -->
  <g transform="translate(57, 280)">
    <rect width="360" height="395" fill="#E8E2D5" stroke="#141414" stroke-width="1.2" />
    <rect x="6" y="6" width="348" height="383" fill="none" stroke="#141414" stroke-width="0.6" stroke-dasharray="3 3" />

    <!-- Photo Framing Placeholder -->
    <g transform="translate(10, 10)">
      <rect width="340" height="290" fill="#202020" rx="2" />
      <rect width="340" height="290" fill="none" stroke="#141414" stroke-width="1" />
    </g>

    <!-- Photo Caption Banner -->
    <g transform="translate(10, 310)">
      <rect width="340" height="65" fill="#141414" rx="2" />
      <text x="170" y="22" font-family="'Inter Tight', sans-serif" font-weight="600" font-size="11" letter-spacing="0.14em" fill="#FFFFFF" text-anchor="middle">
        DOCUMENT D’ÉPOQUE · PHOTO OFFICIELLE
      </text>
      <text x="170" y="42" font-family="'Newsreader', serif" font-style="italic" font-weight="400" font-size="11.5" fill="#D4AF37" text-anchor="middle">
        ${escapeXml(book.categoryTab)}
      </text>
      <text x="170" y="56" font-family="'Inter Tight', sans-serif" font-weight="500" font-size="7.5" letter-spacing="0.15em" fill="#A0AEC0" text-anchor="middle">
        SERVICE HISTORIQUE DE LA DÉFENSE
      </text>
    </g>

    <!-- Red Archival Stamp -->
    <g transform="translate(290, 20) rotate(-10)">
      <rect x="-52" y="-12" width="104" height="24" rx="2" fill="none" stroke="#8B1E1E" stroke-width="1.8" opacity="0.9" />
      <text y="4" font-family="'Inter Tight', sans-serif" font-weight="600" font-size="7.5" letter-spacing="0.14em" fill="#8B1E1E" opacity="0.9" text-anchor="middle">
        ARCHIVES DE GUERRE
      </text>
    </g>
  </g>

  <!-- Bottom Archival Information & Cockade -->
  <g transform="translate(237, 750)" text-anchor="middle">
    <!-- French Tricolor Cockade (blue, white, red) -->
    <circle cx="0" cy="0" r="18" fill="#1F3FB0" />
    <circle cx="0" cy="0" r="12" fill="#FFFFFF" stroke="#141414" stroke-width="0.5" />
    <circle cx="0" cy="0" r="6" fill="#8B1E1E" />

    <text y="38" font-family="'Inter Tight', sans-serif" font-weight="600" font-size="10" letter-spacing="0.15em" fill="#141414">
      FRENCH NATIONAL WAR ARCHIVE
    </text>
    <text y="54" font-family="'Newsreader', serif" font-style="italic" font-weight="400" font-size="11.5" fill="#6D6A63">
      The Six Complete Volumes of France in WWI
    </text>

    <line x1="-80" y1="70" x2="80" y2="70" stroke="#141414" stroke-width="0.8" />
    <text y="86" font-family="'Inter Tight', sans-serif" font-weight="500" font-size="8.5" letter-spacing="0.2em" fill="#141414">
      VOLUME ${book.romanNumeral} OF 6
    </text>
  </g>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Generates bespoke SVG Spine for each of the 5 books
 */
export function generateSpineSvgDataUrl(book: WWIBook): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 142 840" width="142" height="840">
  <defs>
    <linearGradient id="spineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2D3748" />
      <stop offset="30%" stop-color="${book.themeColor}" />
      <stop offset="70%" stop-color="${book.themeColor}" />
      <stop offset="100%" stop-color="#1A202C" />
    </linearGradient>
    <pattern id="spineCloth" width="10" height="10" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="10" y2="10" stroke="#000" stroke-width="0.5" opacity="0.15" />
      <line x1="10" y1="0" x2="0" y2="10" stroke="#000" stroke-width="0.5" opacity="0.15" />
    </pattern>
  </defs>

  <!-- Spine background -->
  <rect width="142" height="840" fill="url(#spineGrad)" />
  <rect width="142" height="840" fill="url(#spineCloth)" />

  <!-- Gold-embossed edge stitching -->
  <line x1="8" y1="12" x2="8" y2="828" stroke="#D4AF37" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.85" />
  <line x1="134" y1="12" x2="134" y2="828" stroke="#D4AF37" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.85" />

  <!-- Top Volume Designation -->
  <g transform="translate(71, 55)" text-anchor="middle">
    <rect x="-42" y="-16" width="84" height="32" fill="#141414" stroke="#D4AF37" stroke-width="1" />
    <text y="5" font-family="'Inter Tight', sans-serif" font-weight="600" font-size="13" letter-spacing="0.25em" fill="#F7F4EC">
      ${book.volumeNumber}
    </text>
  </g>

  <!-- Small Cockade -->
  <g transform="translate(71, 115)">
    <circle cx="0" cy="0" r="14" fill="#1F3FB0" stroke="#D4AF37" stroke-width="0.8" />
    <circle cx="0" cy="0" r="9" fill="#F7F4EC" />
    <circle cx="0" cy="0" r="5" fill="#8B1E1E" />
  </g>

  <!-- Vertical Title on the Spine -->
  <g transform="translate(76, 440) rotate(90)" text-anchor="middle">
    <text font-family="'Inter Tight', sans-serif" font-weight="600" font-size="16" letter-spacing="0.16em" fill="#FFFFFF">
      ${escapeXml(book.title.split(':')[0].toUpperCase())}
    </text>
    <text y="22" font-family="'Newsreader', serif" font-style="italic" font-weight="400" font-size="13" letter-spacing="0.08em" fill="#D4AF37">
      ★ ${escapeXml(book.categoryTab)}
    </text>
  </g>

  <!-- Bottom Details -->
  <g transform="translate(71, 740)" text-anchor="middle">
    <rect x="-35" y="-14" width="70" height="26" fill="none" stroke="#D4AF37" stroke-width="1" />
    <text y="4" font-family="'Inter Tight', sans-serif" font-weight="600" font-size="13" letter-spacing="0.2em" fill="#F7F4EC">
      VOL ${book.romanNumeral}
    </text>

    <!-- Base Seal -->
    <text y="45" font-family="'Inter Tight', sans-serif" font-weight="600" font-size="10" letter-spacing="0.3em" fill="#D4AF37">
      FRANCE
    </text>
    <text y="62" font-family="'Inter Tight', sans-serif" font-weight="500" font-size="7.5" letter-spacing="0.15em" fill="#CBD5E0">
      WAR RECORD
    </text>
  </g>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
