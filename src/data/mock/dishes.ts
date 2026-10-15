import type { Confidence, Dish } from '../../types/restaurant'

const WHY_SUFFIX: Record<Confidence, string> = {
  high: 'This is a simple dish with a standard portion, so the range is fairly narrow.',
  medium: 'Portion sizes can vary a little between kitchens, so the range is a bit wider.',
  low: 'Sauces, mixed ingredients, or portion size make this harder to pin down, so treat it as a rough guide.',
}

// [slug, name, description, price, minG, maxG, confidence, tip, customizations, basis]
type Row = [string, string, string, number, number, number, Confidence, string, string[], string]

function build(restaurantId: string, rows: Row[]): Dish[] {
  return rows.map(
    ([slug, name, description, price, minG, maxG, confidence, tip, customizations, basis]) => ({
      id: `${restaurantId}--${slug}`,
      restaurantId,
      name,
      description,
      price,
      protein: { minG, maxG, confidence },
      customizationTip: tip,
      customizations,
      whyEstimate: `Placeholder estimate based on ${basis}. ${WHY_SUFFIX[confidence]}`,
    }),
  )
}

export const mockDishes: Dish[] = [
  ...build('ember-oak-grill', [
    ['herb-chicken', 'Herb-Grilled Chicken Plate', 'Wood-grilled chicken breast with herb butter, fries, and a side salad.', 17.5, 42, 50, 'high', 'Add extra chicken, swap fries for greens.', ['Double the chicken (+$4.50)', 'Swap fries for grilled vegetables', 'Dressing on the side'], 'a 7 oz grilled chicken breast'],
    ['salmon-farro', 'Grilled Salmon & Farro', 'Cedar-plank salmon over farro with roasted carrots.', 24, 38, 46, 'high', 'Ask for a double portion of salmon and a lemon wedge.', ['Add a second salmon fillet (+$9)', 'Swap farro for a side salad'], 'a 6 oz salmon fillet and a portion of farro'],
    ['sirloin-tips', 'Sirloin Tips & Greens', 'Seared sirloin tips with garlic greens and mashed potatoes.', 22, 40, 48, 'medium', 'Swap mashed potatoes for extra greens.', ['Swap potatoes for greens', 'Add a fried egg (+$2)'], 'about 7 oz of sirloin tips'],
    ['cobb', 'Cobb Salad with Grilled Chicken', 'Chicken, egg, bacon, avocado, and blue cheese over romaine.', 16, 34, 42, 'medium', 'Add extra chicken and keep the dressing on the side.', ['Add extra chicken (+$4)', 'Dressing on the side'], 'grilled chicken, egg, and cheese'],
    ['shrimp-skewer', 'Shrimp Skewer Plate', 'Garlic shrimp skewers with rice pilaf and charred broccoli.', 19.5, 30, 38, 'medium', 'Ask for an extra skewer and swap rice for broccoli.', ['Add a skewer (+$5)', 'Swap rice for broccoli'], 'about 8 large shrimp'],
    ['turkey-burger', 'Smoked Turkey Burger', 'Smoked turkey patty, lettuce, tomato, and pickles on a toasted bun.', 15, 30, 38, 'medium', 'Go lettuce-wrapped and add a side salad.', ['Lettuce wrap instead of bun', 'Add a side salad'], 'a 6 oz turkey patty'],
    ['bbq-chicken', 'BBQ Pulled Chicken Sandwich', 'Slow-cooked chicken with tangy slaw on a brioche roll.', 14.5, 28, 36, 'medium', 'Ask for extra chicken and slaw on the side.', ['Extra chicken (+$3)', 'Slaw on the side'], 'about 5 oz of pulled chicken'],
    ['black-bean', 'Veggie Black Bean Burger', 'House black bean patty with avocado on a toasted bun.', 14, 16, 22, 'low', 'Add a side of grilled chicken or an egg.', ['Add a fried egg (+$2)', 'Add a side of grilled chicken (+$5)'], 'a black bean patty and a bun'],
    ['seasoned-fries', 'Seasoned Fries', 'Crispy fries with house seasoning, great for sharing.', 7, 3, 5, 'high', 'Share with the table and pair with a grilled main.', ['Share with the table'], 'a standard side portion of potatoes'],
  ]),
  ...build('olive-branch', [
    ['souvlaki-plate', 'Chicken Souvlaki Plate', 'Marinated chicken skewers, rice, tzatziki, and Greek salad.', 16.5, 40, 48, 'high', 'Ask for an extra skewer and extra tzatziki.', ['Add a skewer (+$4)', 'Swap rice for extra salad'], 'two chicken skewers with tzatziki'],
    ['branzino', 'Grilled Branzino', 'Whole grilled branzino with lemon, herbs, and roasted vegetables.', 24, 40, 48, 'medium', 'Pair with a lentil soup starter for extra protein.', ['Add lentil soup (+$5)', 'Swap potatoes for greens'], 'a whole grilled fish, edible portion'],
    ['kofta-bowl', 'Lamb Kofta Bowl', 'Spiced lamb kofta over rice with cucumber salad and hummus.', 18, 34, 42, 'medium', 'Double the kofta and go light on rice.', ['Double kofta (+$5)', 'Half rice, extra salad'], 'about 6 oz of lamb kofta'],
    ['greek-salmon', 'Greek Salad with Salmon', 'Cucumber, tomato, olives, and feta topped with grilled salmon.', 19, 32, 40, 'medium', 'Add chickpeas and an extra piece of salmon.', ['Add chickpeas (+$2)', 'Extra salmon (+$6)'], 'a 5 oz salmon fillet and feta'],
    ['chicken-pita', 'Hummus & Chicken Pita Plate', 'Warm pita, hummus, grilled chicken, and pickled vegetables.', 15, 30, 38, 'medium', 'Ask for extra chicken and a side of tzatziki.', ['Extra chicken (+$3.50)', 'Add tzatziki'], 'grilled chicken and hummus'],
    ['shrimp-orzo', 'Shrimp Orzo', 'Tomato-braised shrimp with orzo and feta.', 20, 28, 36, 'low', 'Add a side of grilled chicken to round it out.', ['Add grilled chicken (+$4)'], 'a mixed shrimp and pasta dish'],
    ['falafel-wrap', 'Falafel Wrap', 'Crispy falafel, tahini, pickles, and greens in a warm wrap.', 12.5, 18, 24, 'medium', 'Add a side of hummus and a Greek yogurt dip.', ['Add hummus (+$2)', 'Add a side salad'], 'chickpea falafel and tahini'],
    ['lentil-soup', 'Lentil Soup & Side Salad', 'Hearty lemon-lentil soup with a small salad.', 11, 14, 20, 'medium', 'Add a skewer of chicken on the side.', ['Add a chicken skewer (+$4)'], 'a bowl of lentil soup'],
  ]),
  ...build('casa-marigold', [
    ['carne-asada', 'Carne Asada Plate', 'Grilled marinated steak with rice, beans, and charred peppers.', 18.5, 40, 50, 'medium', 'Ask for extra steak and extra beans, skip the rice.', ['Extra steak (+$5)', 'Double beans, no rice'], 'about 7 oz of grilled steak and beans'],
    ['fajita-skillet', 'Chicken Fajita Skillet', 'Sizzling chicken, peppers, and onions with warm tortillas.', 17, 38, 46, 'high', 'Add extra chicken and use fewer tortillas.', ['Extra chicken (+$4)', 'Add black beans'], 'a 7 oz serving of grilled chicken'],
    ['chicken-bowl', 'Burrito Bowl with Chicken', 'Chicken, rice, beans, pico, and greens in a big bowl.', 14, 36, 44, 'medium', 'Double chicken and add beans.', ['Double chicken (+$3.50)', 'Add black beans'], 'a bowl with chicken and beans'],
    ['shrimp-tacos', 'Shrimp Tacos (3)', 'Grilled shrimp, cabbage slaw, and lime crema on corn tortillas.', 15.5, 24, 32, 'medium', 'Add a side of black beans.', ['Add black beans (+$2)', 'Add a fourth taco (+$4)'], 'about 6 shrimp per three tacos'],
    ['fish-tacos', 'Grilled Fish Tacos', 'Seasoned white fish with mango salsa on corn tortillas.', 15, 22, 30, 'medium', 'Add beans and extra fish.', ['Extra fish (+$4)', 'Add black beans (+$2)'], 'three small portions of white fish'],
    ['chilaquiles', 'Chilaquiles with Eggs', 'Tortilla chips in salsa verde with two eggs and queso fresco.', 13.5, 20, 28, 'medium', 'Add grilled chicken on top.', ['Add chicken (+$4)', 'Extra egg (+$1.50)'], 'two eggs and cheese'],
    ['tortilla-soup', 'Chicken Tortilla Soup', 'Tomato-chile broth with chicken, avocado, and tortilla strips.', 12, 22, 30, 'low', 'Add extra chicken to the bowl.', ['Extra chicken (+$3)'], 'a bowl of soup with shredded chicken'],
    ['quesadilla', 'Bean & Cheese Quesadilla', 'Grilled flour tortilla with black beans and melted cheese.', 11.5, 18, 24, 'medium', 'Add chicken or steak inside.', ['Add chicken (+$3.50)', 'Add steak (+$4.50)'], 'beans and cheese in a tortilla'],
  ]),
  ...build('lotus-table', [
    ['salmon-soba', 'Seared Salmon Soba', 'Seared salmon over cold soba noodles with sesame greens.', 22, 36, 44, 'medium', 'Add an egg and extra edamame.', ['Add an egg (+$2)', 'Add edamame (+$3)'], 'a 5 oz salmon fillet and soba noodles'],
    ['garlic-shrimp', 'Garlic Shrimp & Greens', 'Wok-seared garlic shrimp with bok choy and broccoli.', 20, 34, 42, 'high', 'Ask for brown rice and extra shrimp.', ['Extra shrimp (+$5)', 'Brown rice instead of white'], 'about 10 large shrimp'],
    ['teriyaki-bowl', 'Teriyaki Chicken Rice Bowl', 'Grilled teriyaki chicken, rice, and steamed vegetables.', 15.5, 34, 42, 'medium', 'Double the chicken and ask for sauce on the side.', ['Double chicken (+$4)', 'Sauce on the side'], 'a 6 oz portion of grilled chicken'],
    ['beef-broccoli', 'Beef & Broccoli', 'Sliced beef and broccoli in a savory brown sauce.', 17.5, 32, 40, 'medium', 'Ask for extra broccoli and half the rice.', ['Extra beef (+$4)', 'Half rice'], 'about 6 oz of sliced beef'],
    ['tofu-stirfry', 'Tofu & Edamame Stir-Fry', 'Crispy tofu with edamame, peppers, and ginger sauce.', 14, 24, 32, 'medium', 'Add an egg or a side of edamame.', ['Add an egg (+$2)', 'Add edamame (+$3)'], 'firm tofu and edamame'],
    ['pho', 'Chicken Pho (Large)', 'Rice noodles in aromatic broth with sliced chicken and herbs.', 14.5, 28, 36, 'low', 'Ask for extra chicken and go easy on noodles.', ['Extra chicken (+$3.50)'], 'a large bowl of noodle soup'],
    ['pad-thai', 'Pad Thai with Chicken', 'Rice noodles with chicken, egg, peanuts, and lime.', 16, 26, 34, 'low', 'Add extra chicken or tofu.', ['Extra chicken (+$4)', 'Add tofu (+$3)'], 'a noodle dish with chicken and egg'],
    ['miso-edamame', 'Miso Soup & Edamame', 'Warm miso soup with a bowl of salted edamame.', 8.5, 12, 16, 'high', 'Pair with a main for a complete meal.', ['Pair with a rice bowl'], 'a bowl of miso and a cup of edamame'],
  ]),
  ...build('sunday-grounds', [
    ['egg-white-scramble', 'Egg White Veggie Scramble', 'Egg whites with spinach, peppers, and feta, with toast.', 11.5, 22, 28, 'high', 'Add turkey sausage for extra protein.', ['Add turkey sausage (+$3)', 'Swap toast for fruit'], 'a scramble of about six egg whites'],
    ['chicken-wrap', 'Chicken Avocado Wrap', 'Grilled chicken, avocado, and greens in a spinach wrap.', 13, 28, 35, 'medium', 'Ask for double chicken.', ['Double chicken (+$3)', 'Side salad instead of chips'], 'a 5 oz portion of grilled chicken'],
    ['tuna-plate', 'Tuna Salad Plate', 'House tuna salad with greens, tomato, and whole-grain crackers.', 12, 28, 34, 'medium', 'Skip the crackers and add an egg.', ['Add a hard-boiled egg (+$1.50)'], 'about one can of tuna'],
    ['turkey-swiss', 'Turkey & Swiss Sandwich', 'Roasted turkey, Swiss, lettuce, and tomato on multigrain.', 12.5, 26, 32, 'medium', 'Ask for extra turkey.', ['Extra turkey (+$3)', 'Side salad'], 'about 4 oz of turkey and a slice of cheese'],
    ['salmon-toast', 'Smoked Salmon Toast', 'Smoked salmon, cream cheese, capers, and cucumber on rye.', 14, 22, 28, 'medium', 'Add an egg on top.', ['Add an egg (+$2)'], 'about 3 oz of smoked salmon'],
    ['cottage-plate', 'Cottage Cheese & Fruit Plate', 'Cottage cheese with berries, melon, and a drizzle of honey.', 9, 18, 24, 'high', 'Add a handful of nuts.', ['Add almonds (+$1.50)'], 'a one-cup serving of cottage cheese'],
    ['yogurt-bowl', 'Greek Yogurt & Nut Bowl', 'Thick yogurt with berries, granola, and almonds.', 8.5, 14, 20, 'medium', 'Ask for extra yogurt and less granola.', ['Extra yogurt (+$1.50)'], 'a large serving of Greek yogurt'],
    ['chicken-croissant', 'Chicken Salad Croissant', 'Creamy chicken salad on a buttery croissant.', 13.5, 24, 32, 'low', 'Ask for an open-faced version with a side salad.', ['Open-faced', 'Side salad'], 'a scoop of chicken salad'],
    ['protein-oats', 'Protein Oatmeal Cup', 'Oats cooked with milk and a scoop of protein powder.', 9.5, 16, 22, 'low', 'Top with nuts and Greek yogurt.', ['Add Greek yogurt (+$1.50)'], 'oats with milk and a protein scoop'],
  ]),
  ...build('saffron-courtyard', [
    ['chicken-shish', 'Chicken Shish Kebab Platter', 'Charcoal-grilled saffron chicken with rice and grilled tomato.', 19.5, 44, 52, 'high', 'Extra kebab, half rice, extra grilled vegetables.', ['Add a kebab (+$5)', 'Half rice, extra vegetables'], 'two chicken kebab skewers'],
    ['salmon-kebab', 'Salmon Kebab Plate', 'Herbed salmon skewers with rice and cucumber salad.', 24, 38, 46, 'high', 'Add a side of lentil stew.', ['Add lentil stew (+$4)', 'Extra salad'], 'two salmon skewers'],
    ['beef-kebab', 'Beef Kebab Platter', 'Ground beef kebabs with rice, grilled tomato, and onion.', 22, 40, 48, 'medium', 'Skip the rice for a double side of vegetables.', ['Extra vegetables instead of rice'], 'two beef kebabs'],
    ['lamb-chops', 'Grilled Lamb Chops', 'Four lamb chops with roasted potatoes and herb salad.', 27, 40, 48, 'medium', 'Swap potatoes for the herb salad.', ['Swap potatoes for salad'], 'four small lamb chops'],
    ['saffron-chicken', 'Saffron Chicken & Rice', 'Braised chicken thigh in saffron sauce over basmati.', 18.5, 36, 44, 'medium', 'Ask for extra chicken and half the rice.', ['Extra chicken (+$4)', 'Half rice'], 'a braised chicken thigh and drumstick'],
    ['mezze-chicken', 'Mezze Plate with Chicken', 'Hummus, tabbouleh, labneh, and sliced chicken with pita.', 17, 28, 36, 'low', 'Add a chicken kebab on the side.', ['Add a kebab (+$5)'], 'a shared-style mezze plate with chicken'],
    ['halloumi-salad', 'Grilled Halloumi Salad', 'Grilled halloumi, greens, pomegranate, and mint.', 15.5, 22, 28, 'medium', 'Add chickpeas or chicken.', ['Add chicken (+$4)', 'Add chickpeas (+$2)'], 'about 4 oz of halloumi'],
    ['lentil-stew', 'Lentil & Spinach Stew', 'Slow-simmered lentils and spinach with lemon.', 14, 16, 22, 'medium', 'Add a chicken kebab.', ['Add a kebab (+$5)'], 'a bowl of lentil stew'],
  ]),
  ...build('bamboo-street', [
    ['steamed-fish', 'Steamed Fish & Bok Choy', 'Ginger-scallion steamed white fish with bok choy and rice.', 21, 34, 42, 'high', 'Ask for brown rice and extra bok choy.', ['Brown rice', 'Extra bok choy'], 'a 6 oz portion of steamed fish'],
    ['spicy-basil', 'Spicy Basil Chicken', 'Chili-basil chicken stir-fry with a fried egg over rice.', 15.5, 36, 44, 'medium', 'Add extra chicken and skip half the rice.', ['Extra chicken (+$4)', 'Half rice'], 'chicken stir-fry plus an egg'],
    ['bulgogi-bowl', 'Bulgogi Bowl', 'Marinated beef over rice with kimchi and sesame greens.', 16.5, 34, 42, 'medium', 'Double the beef and add an egg.', ['Double beef (+$4.50)', 'Add an egg (+$1.50)'], 'about 6 oz of marinated beef'],
    ['banh-mi-bowl', 'Grilled Chicken Banh Mi Bowl', 'Lemongrass chicken, pickled vegetables, herbs, and rice.', 14.5, 32, 40, 'medium', 'Extra chicken, light on the sauce.', ['Extra chicken (+$3.50)', 'Sauce on the side'], 'a 5 oz portion of lemongrass chicken'],
    ['chicken-skewers-soup', 'Egg Drop Soup & Chicken Skewers', 'Silky egg drop soup with two grilled chicken skewers.', 13.5, 26, 34, 'medium', 'Add a third skewer.', ['Add a skewer (+$3)'], 'soup with eggs and two chicken skewers'],
    ['tofu-bibimbap', 'Tofu Bibimbap', 'Rice bowl with crispy tofu, vegetables, and a fried egg.', 15, 24, 32, 'medium', 'Add an extra egg for a protein boost.', ['Extra egg (+$1.50)', 'Add beef (+$4)'], 'tofu and an egg over rice'],
    ['beef-noodle', 'Beef Noodle Soup', 'Slow-braised beef in rich broth with noodles and greens.', 15, 26, 36, 'low', 'Ask for extra beef.', ['Extra beef (+$4)'], 'a large bowl of noodle soup with beef'],
    ['summer-rolls', 'Shrimp Summer Rolls (4)', 'Fresh rolls with shrimp, herbs, and peanut sauce.', 11, 16, 22, 'medium', 'Add a protein-forward soup on the side.', ['Add egg drop soup (+$4)'], 'four rolls with small shrimp'],
  ]),
  ...build('prairie-pine', [
    ['filet', 'Filet Mignon (8 oz)', 'Center-cut filet with roasted garlic and seasonal greens.', 46, 48, 56, 'high', 'Choose greens over potatoes and add a side salad.', ['Swap potatoes for greens', 'Add a side salad'], 'an 8 oz cooked filet'],
    ['ribeye', 'Ribeye (12 oz)', 'Hand-cut ribeye with house steak butter.', 48, 62, 72, 'medium', 'Share a side of vegetables and skip the potato.', ['Swap potato for vegetables'], 'a 12 oz ribeye, trimmed weight varies'],
    ['pork-chop', 'Grilled Pork Chop', 'Thick-cut chop with apple chutney and sautéed greens.', 32, 44, 52, 'medium', 'Ask for greens in place of potatoes.', ['Swap potatoes for greens'], 'a 10 oz bone-in pork chop'],
    ['half-chicken', 'Roasted Half Chicken', 'Herb-roasted half chicken with pan juices and vegetables.', 29, 48, 56, 'medium', 'Ask for extra vegetables instead of mash.', ['Vegetables instead of mash'], 'a roasted half chicken, edible portion'],
    ['salmon-fillet', 'Salmon Fillet', 'Pan-seared salmon with lemon butter and asparagus.', 34, 40, 48, 'high', 'Add a side salad and skip the butter sauce if you like.', ['Sauce on the side', 'Add a side salad'], 'a 7 oz salmon fillet'],
    ['steak-salad', 'Steak Salad', 'Sliced sirloin over greens with tomato and blue cheese.', 28, 34, 42, 'medium', 'Ask for dressing on the side and extra steak.', ['Extra steak (+$8)', 'Dressing on the side'], 'about 6 oz of sliced sirloin'],
    ['prime-burger', 'Prime Burger', 'Half-pound prime beef burger with cheddar and lettuce.', 24, 34, 42, 'medium', 'Go lettuce-wrapped and add a side salad.', ['Lettuce wrap', 'Add a side salad'], 'a half-pound beef patty and cheese'],
    ['scallops', 'Seared Scallops', 'Four jumbo scallops with corn purée and greens.', 38, 30, 38, 'medium', 'Add a side of chicken or a salad.', ['Add a side salad (+$6)'], 'four large sea scallops'],
    ['lobster-mac', 'Lobster Mac & Cheese', 'Cavatappi with lobster and gruyère cream sauce.', 36, 24, 32, 'low', 'Share it and pair with a grilled main.', ['Share with the table'], 'a pasta dish with a portion of lobster'],
  ]),
]
