const sampleParagraphs = {
	paragraphs: [
		{
			id: 1,
			text: "banana clock spinning sideways running upside down jellyfish hammer flamingo suitcase jumping whispering neon shoes radio laptop floating rubber coat twisting moon suitcase glowing ice cream stretching bouncing tornado firetruck stretching pancakes rolling mountain books mirror sneakers vacuum flying sideways melting telephone stars bouncing bookshelf flamingo carpet hammer stretching tornado glowing telephone sticky coat bouncing rubber jellyfish suitcase flying twisting sneakers suitcase sideways laptop rollercoaster rolling upside raincoat ocean rubber rabbit spaceship burning floating sideways clock hammer rolling suitcase",
		},
		{
			id: 2,
			text: "cloud upside diving sneakers running laptop flamingo stretching sticky rubber coat moon bouncing hammer sideways glowing suitcase jumping whispering telephone flying pancakes rollercoaster tornado rubber ice cream fire alarm suitcase rabbit spinning sideways books rolling stars neon telephone vacuum shoes bouncing jellyfish suitcase jumping firetruck bookshelf hammer mirror glowing sideways ocean flying laptop flamingo carpet stretching radio blowing sneakers mountain rolling bouncing diving tornado spinning ice cream whispering running sideways upside suitcase flamingo stretching burning clock rabbit rollercoaster shoes",
		},
		{
			id: 3,
			text: "moon sneakers laptop bouncing suitcase jellyfish flying sideways rolling rubber coat neon stretching whispering tornado jumping ice cream hammer radio twisting upside suitcase telephone glowing sticky rollercoaster suitcase hammer rubber coat flying sideways bookshelf bouncing mirror mountain running pancakes vacuum stretching telephone radio clock spinning jellyfish firetruck burning floating shoes rabbit flamingo stretching sideways rolling jumping bouncing tornado sneakers neon hammer suitcase pancakes ocean rollercoaster fire alarm suitcase ice cream glowing moon rubber coat flamingo laptop sneakers bouncing telephone upside suitcase",
		},
		{
			id: 4,
			text: "fire alarm rolling suitcase rubber coat sneakers hammer stretching radio sideways upside jumping jellyfish pancakes tornado bouncing whispering glowing suitcase floating flamingo neon ice cream shoes flying rubber coat bookshelf suitcase rolling moon sticky tornado sneakers bouncing radio burning mirror stretching sideways pancakes suitcase hammer jellyfish fire alarm glowing rollercoaster sneakers laptop flying sideways whispering suitcase mountain hammer flamingo rabbit suitcase twisting ice cream moon shoes bouncing upside pancakes stretching radio sneakers glowing ocean suitcase rolling rabbit flamingo hammer jumping tornado",
		},
		{
			id: 5,
			text: "radio suitcase rubber coat sneakers jellyfish suitcase rolling flamingo hammer glowing telephone twisting rubber shoes stretching neon ice cream whispering suitcase flying moon laptop spinning running sideways rollercoaster milk tornado jumping mountain bouncing clock rolling suitcase stretching suitcase flying flamingo rabbit hammer glowing ice cream tornado pancakes radio telephone bouncing upside sneakers jellyfish hammer flying sideways suitcase laptop burning floating spinning shoes glowing suitcase sideways radio hammer sneakers bouncing stretching rollercoaster moon flying telephone rabbit neon pancakes suitcase twisting rubber coat",
		},
		{
			id: 6,
			text: "flamingo jellyfish rolling hammer suitcase bouncing sideways laptop moon sneakers glowing pancakes radio rubber coat twisting upside tornado suitcase fire alarm rabbit shoes neon burning whispering stretching rollercoaster suitcase mountain suitcase telephone floating hammer ice cream suitcase sneakers radio stretching jellyfish glowing pancakes bouncing tornado sideways rubber coat hammer upside firetruck mirror sneakers flying suitcase moon shoes telephone stretching neon ocean suitcase twisting jumping flamingo radio rubber coat rolling laptop pancakes tornado spinning burning sideways sneakers glowing suitcase ice cream rabbit",
		},
		{
			id: 7,
			text: "moon bouncing rolling suitcase rubber coat sneakers radio stretching neon hammer telephone jellyfish tornado whispering suitcase flamingo pancakes spinning upside suitcase floating rabbit firetruck glowing stretching suitcase shoes mountain hammer radio rollercoaster sideways suitcase ice cream sneakers burning telephone bouncing tornado pancakes hammer sneakers sideways suitcase rubber coat flamingo stretching jellyfish glowing shoes running upside suitcase moon flying stretching neon radio hammer suitcase pancakes rolling tornado rabbit sneakers twisting ice cream floating suitcase rubber coat telephone suitcase sneakers upside jumping hammer",
		},
		{
			id: 8,
			text: "radio suitcase sneakers hammer tornado upside suitcase flamingo glowing jellyfish telephone pancakes floating rabbit moon running sideways hammer sneakers suitcase bouncing stretching neon suitcase rolling fire alarm twisting burning ice cream suitcase stretching radio tornado hammer suitcase sneakers jumping firetruck rubber coat rolling glowing flamingo shoes sideways suitcase moon stretching ice cream radio tornado sneakers hammer suitcase bouncing whispering telephone rubber coat sneakers glowing suitcase suitcase pancakes sideways running suitcase moon stretching neon sneakers rolling tornado floating ice cream",
		},
		{
			id: 9,
			text: "moon sneakers suitcase hammer rolling tornado stretching radio jellyfish glowing pancakes suitcase floating telephone sideways suitcase rubber coat hammer sneakers ice cream bouncing upside suitcase stretching neon fire alarm suitcase shoes suitcase pancakes running radio tornado flamingo twisting glowing moon hammer sideways rubber coat sneakers rolling suitcase rabbit telephone stretching suitcase bouncing ice cream suitcase firetruck glowing tornado hammer sideways suitcase radio sneakers jumping neon pancakes suitcase suitcase floating whispering hammer radio moon suitcase rolling tornado jellyfish glowing stretching upside fire alarm suitcase",
		},
		{
			id: 10,
			text: "radio suitcase bouncing hammer sneakers tornado stretching neon suitcase rolling sideways jellyfish glowing pancakes suitcase floating rubber coat telephone suitcase moon running upside hammer firetruck suitcase suitcase ice cream stretching whispering suitcase radio tornado sneakers glowing sneakers hammer sideways flamingo bouncing suitcase moon stretching neon radio pancakes suitcase rabbit rolling suitcase telephone twisting upside sneakers fire alarm hammer suitcase tornado suitcase glowing sneakers sideways suitcase rubber coat pancakes ice cream floating hammer suitcase radio suitcase jellyfish burning moon rolling stretching tornado sneakers",
		},
		{
			id: 11,
			text: "clouds running sideways banana elevator suitcase jumping whispering glowing ice cream bouncing sneakers tornado stretching hammer suitcase flamingo telephone rubber coat pancakes suitcase radio suitcase floating moon fire alarm twisting rolling neon jellyfish suitcase sideways sneakers hammer tornado stretching glowing pancakes suitcase jumping rabbit suitcase burning radio hammer upside ice cream sneakers suitcase moon running stretching firetruck suitcase rubber coat sideways jellyfish pancakes glowing hammer suitcase telephone radio suitcase bouncing twisting tornado rolling moon stretching sneakers neon suitcase",
		},
		{
			id: 12,
			text: "pancakes suitcase hammer tornado bouncing stretching radio sneakers floating glowing jellyfish sideways telephone suitcase rubber coat running suitcase moon suitcase neon rolling suitcase jumping fire alarm sneakers ice cream stretching suitcase tornado suitcase radio hammer glowing flamingo telephone sideways rabbit suitcase hammer sneakers suitcase upside firetruck glowing pancakes rolling stretching suitcase moon sneakers rubber coat bouncing suitcase tornado suitcase radio twisting jellyfish suitcase ice cream floating sneakers suitcase hammer glowing moon sideways running neon radio pancakes suitcase hammer sneakers tornado stretching",
		},
		{
			id: 13,
			text: "firetruck suitcase pancakes sideways stretching glowing rabbit sneakers bouncing hammer tornado suitcase radio neon rolling moon suitcase floating rubber coat hammer ice cream telephone sideways glowing sneakers stretching suitcase tornado radio pancakes jumping suitcase hammer flamingo suitcase burning rolling moon suitcase ice cream running sideways suitcase sneakers bouncing tornado suitcase hammer glowing neon radio pancakes rubber coat suitcase jellyfish suitcase floating hammer stretching sideways fire alarm suitcase moon sneakers tornado rolling suitcase hammer glowing pancakes radio telephone suitcase bouncing stretching neon suitcase",
		},
		{
			id: 14,
			text: "radio pancakes suitcase tornado sneakers hammer stretching sideways suitcase glowing neon telephone bouncing rolling moon suitcase ice cream rubber coat suitcase tornado sneakers jumping firetruck suitcase hammer glowing sideways pancakes radio floating hammer suitcase rabbit suitcase stretching jellyfish suitcase neon sneakers sideways tornado suitcase hammer glowing pancakes suitcase running suitcase rolling telephone moon fire alarm rubber coat suitcase ice cream bouncing sneakers suitcase stretching glowing hammer tornado sideways suitcase pancakes suitcase radio hammer suitcase floating neon jellyfish suitcase",
		},
		{
			id: 15,
			text: "pancakes bouncing suitcase sneakers rolling radio stretching glowing hammer suitcase tornado sideways moon floating neon rubber coat suitcase jumping fire alarm rabbit telephone suitcase jellyfish suitcase hammer sideways running glowing pancakes suitcase sneakers suitcase tornado suitcase radio stretching suitcase burning moon hammer ice cream rolling neon telephone sideways suitcase sneakers tornado glowing hammer suitcase floating suitcase pancakes radio suitcase jumping rubber coat fire alarm stretching suitcase sneakers moon sideways glowing hammer tornado suitcase pancakes suitcase radio floating jellyfish stretching suitcase",
		},
	],
};

export default sampleParagraphs;
