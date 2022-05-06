import {User} from "types/userType";


export interface Avatar {
    user: User,
    userId: string,
    topType: TopType,
    accessoriesType: AccessoriesType,
    hairColor: HairColor,
    facialHairType: FacialHairType,
    facialHairColor: FacialHairColor,
    clotheType: ClotheType,
    clotheColor: ClotheColor,
    eyeType: EyeType,
    eyebrowType: EyebrowType,
    mouthType: MouthType,
    skinColor: SkinColor,
}

export enum TopType {
    NoHair = "NoHair",
    Eyepatch = "Eyepatch",
    Hat = "Hat",
    Hijab = "Hijab",
    Turban = "Turban",
    WinterHat1 = "WinterHat1",
    WinterHat2 = "WinterHat2",
    WinterHat3 = "WinterHat3",
    WinterHat4 = "WinterHat4",
    LongHairBigHair = "LongHairBigHair",
    LongHairBob = "LongHairBob",
    LongHairBun = "LongHairBun",
    LongHairCurly = "LongHairCurly",
    LongHairCurvy = "LongHairCurvy",
    LongHairDreads = "LongHairDreads",
    LongHairFrida = "LongHairFrida",
    LongHairFro = "LongHairFro",
    LongHairFroBand = "LongHairFroBand",
    LongHairNotTooLong = "LongHairNotTooLong",
    LongHairShavedSides = "LongHairShavedSides",
    LongHairMiaWallace = "LongHairMiaWallace",
    LongHairStraight = "LongHairStraight",
    LongHairStraight2 = "LongHairStraight2",
    LongHairStraightStrand = "LongHairStraightStrand",
    ShortHairDreads01 = "ShortHairDreads01",
    ShortHairDreads02 = "ShortHairDreads02",
    ShortHairFrizzle = "ShortHairFrizzle",
    ShortHairShaggyMullet = "ShortHairShaggyMullet",
    ShortHairShortCurly = "ShortHairShortCurly",
    ShortHairShortFlat = "ShortHairShortFlat",
    ShortHairShortRound = "ShortHairShortRound",
    ShortHairShortWaved = "ShortHairShortWaved",
    ShortHairSides = "ShortHairSides",
    ShortHairTheCaesar = "ShortHairTheCaesar",
    ShortHairTheCaesarSidePart = "ShortHairTheCaesarSidePart"
}

export enum AccessoriesType {
    Blank = "Blank",
    Kurt = "Kurt",
    Prescription01 = "Prescription01",
    Prescription02 = "Prescription02",
    Round = "Round",
    Sunglasses = "Sunglasses",
    Wayfarers = "Wayfarers"
}

export enum HairColor {
    Auburn = "Auburn",
    Black = "Black",
    Blonde = "Blonde",
    BlondeGolden = "BlondeGolden",
    Brown = "Brown",
    BrownDark = "BrownDark",
    PastelPink = "PastelPink",
    Blue = "Blue",
    Platinum = "Platinum",
    Red = "Red",
    SilverGray = "SilverGray"
}

export enum FacialHairType {
    Blank = "Blank",
    BeardMedium = "BeardMedium",
    BeardLight = "BeardLight",
    BeardMajestic = "BeardMajestic",
    MoustacheFancy = "MoustacheFancy",
    MoustacheMagnum = "MoustacheMagnum"
}

export enum FacialHairColor {
    Auburn = "Auburn",
    Black = "Black",
    Blonde = "Blonde",
    BlondeGolden = "BlondeGolden",
    Brown = "Brown",
    BrownDark = "BrownDark",
    Platinum = "Platinum",
    Red = "Red"
}

export enum ClotheType {
    BlazerShirt = "BlazerShirt",
    BlazerSweater = "BlazerSweater",
    CollarSweater = "CollarSweater",
    GraphicShirt = "GraphicShirt",
    Hoodie = "Hoodie",
    Overall = "Overall",
    ShirtCrewNeck = "ShirtCrewNeck",
    ShirtScoopNeck = "ShirtScoopNeck",
    ShirtVNeck = "ShirtVNeck"
}

export enum ClotheColor {
    Black = "Black",
    Blue01 = "Blue01",
    Blue02 = "Blue02",
    Blue03 = "Blue03",
    Gray01 = "Gray01",
    Gray02 = "Gray02",
    Heather = "Heather",
    PastelBlue = "PastelBlue",
    PastelGreen = "PastelGreen",
    PastelOrange = "PastelOrange",
    PastelRed = "PastelRed",
    PastelYellow = "PastelYellow",
    Pink = "Pink",
    Red = "Red",
    White = "White"
}

export enum EyeType {
    Close = "Close",
    Cry = "Cry",
    Default = "Default",
    Dizzy = "Dizzy",
    EyeRoll = "EyeRoll",
    Happy = "Happy",
    Hearts = "Hearts",
    Side = "Side",
    Squint = "Squint",
    Surprised = "Surprised",
    Wink = "Wink",
    WinkWacky = "WinkWacky",
}

export enum EyebrowType {
    Angry = "Angry",
    AngryNatural = "AngryNatural",
    Default = "Default",
    DefaultNatural = "DefaultNatural",
    FlatNatural = "FlatNatural",
    RaisedExcited = "RaisedExcited",
    RaisedExcitedNatural = "RaisedExcitedNatural",
    SadConcerned = "SadConcerned",
    SadConcernedNatural = "SadConcernedNatural",
    UnibrowNatural = "UnibrowNatural",
    UpDown = "UpDown",
    UpDownNatural = "UpDownNatural"
}

export enum MouthType {
    Concerned = "Concerned",
    Default = "Default",
    Disbelief = "Disbelief",
    Eating = "Eating",
    Grimace = "Grimace",
    Sad = "Sad",
    ScreamOpen = "ScreamOpen",
    Serious = "Serious",
    Smile = "Smile",
    Tongue = "Tongue",
    Twinkle = "Twinkle",
    Vomit = "Vomit"
}

export enum SkinColor {
    Tanned = "Tanned",
    Yellow = "Yellow",
    Pale = "Pale",
    Light = "Light",
    Brown = "Brown",
    DarkBrown = "DarkBrown",
    Black = "Black"
}