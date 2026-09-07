/**
 * Owner-verified photographs of the Las Vegas Mahjong Studio.
 *
 * This file exists because of a mistake. Two open-play photographs were once used as
 * pictures of the studio on the strength of a filename and a visual hunch, and neither was
 * taken there. Provenance now lives in one place, next to the alt text that depends on it,
 * so a photo cannot be described as a room unless someone recorded that it shows that room.
 *
 * Every entry below was supplied and identified by the owner on 2026-09-07. `shows` is the
 * claim the alt text is allowed to make. Do not add an entry from a filename, a folder or a
 * resemblance to another photo: if the owner has not said what it is, it does not go here.
 *
 * Sources are the owner's originals in ~/Downloads. Each was passed through sharp with
 * .rotate() to bake EXIF orientation into the pixels, because Next's optimizer strips EXIF
 * and six of these were portrait photos stored as landscape.
 */
export interface StudioPhoto {
  /** Path under public/. */
  src: string;
  /** The owner's original filename, kept so the source can always be traced back. */
  source: string;
  /** What the owner confirmed this photograph shows. */
  shows: string;
  /** Which named room, when the owner identified one. Undefined means no room claim. */
  room?: "Lucky Wishbone" | "Lucky Sevens";
  alt: string;
  width: number;
  height: number;
}

export const WISHBONE_ROOM: StudioPhoto = {
  src: "/studio-lucky-wishbone-room.jpg",
  source: "wishbone lessons photo.JPG",
  shows: "The Lucky Wishbone lessons room, set up for a class",
  room: "Lucky Wishbone",
  alt: "The Lucky Wishbone lesson room at the Las Vegas Mahjong Studio, with mahjong tables, blue velvet chairs and a pink tile-patterned wall",
  width: 2000,
  height: 1500,
};

export const SEVENS_OPEN_PLAY: StudioPhoto = {
  src: "/studio-lucky-sevens-open-play.jpg",
  source: "lucky 7 open play room.JPG",
  shows: "Social Open Play under way across several tables in Lucky Sevens",
  room: "Lucky Sevens",
  alt: "Players at several tables during Social Open Play in the Lucky Sevens room at the Las Vegas Mahjong Studio",
  width: 2000,
  height: 1500,
};

export const SHAUNA_AT_TABLE: StudioPhoto = {
  src: "/studio-shauna-mahjong-table.jpg",
  source: "IMG_8668.JPG",
  shows: "Shauna beside a set mahjong table, under the studio's wall sign",
  alt: "Shauna inside the Las Vegas Mahjong Studio beside a mahjong table, under a sign reading Welcome to Las Vegas Mahjong's Mahjong Table",
  width: 2000,
  height: 1500,
};

export const SHAUNA_NEON: StudioPhoto = {
  src: "/studio-shauna-neon-sign.jpg",
  source: "Lessons Room shauina pointing to sign.JPG",
  shows: "Shauna pointing to the Let's Mahjong neon sign on the pink tile wall",
  alt: "Shauna inside the Las Vegas Mahjong Studio, pointing to a neon sign reading Let's Mahjong on the pink tile-patterned wall",
  width: 1050,
  height: 1400,
};

export const LESSON_TABLE: StudioPhoto = {
  src: "/studio-lesson-table-set.jpg",
  source: "IMG_8962 2.JPG",
  shows: "A table set for a lesson: tiles, racks, mat and printed how-to-play materials on every chair",
  room: "Lucky Wishbone",
  alt: "A mahjong lesson table at the Las Vegas Mahjong Studio set with tiles, racks, a mat and printed how-to-play materials on every chair",
  width: 1800,
  height: 1350,
};

export const OPEN_PLAY_SNACKS: StudioPhoto = {
  src: "/studio-open-play-snacks.jpg",
  source: "IMG_8661.JPG",
  shows: "The open play room snack station beside the studio's house-rules sign",
  alt: "The snack station in the open play room at the Las Vegas Mahjong Studio, beside a framed Open Play Room house rules sign",
  width: 1800,
  height: 1350,
};

export const OPEN_PLAY_PLAYERS: StudioPhoto = {
  src: "/studio-open-play-players.jpg",
  source: "IMG_8901.JPG",
  shows: "Four players smiling around a table during open play",
  alt: "Four players smiling around a mahjong table during open play at the Las Vegas Mahjong Studio",
  width: 1200,
  height: 1600,
};

export const OPEN_PLAY_ROOM: StudioPhoto = {
  src: "/studio-open-play-room.jpg",
  source: "IMG_8897 2.JPG",
  shows: "A full room of players across several tables during open play",
  alt: "A full room of players across several mahjong tables during open play at the Las Vegas Mahjong Studio",
  width: 2000,
  height: 1500,
};

/**
 * The owner grouped this one under community activity and did not say which room it is in,
 * so it makes no room claim. The wall behind it resembles the Lucky Wishbone wallpaper, but
 * matching a wallpaper is the kind of inference that put open play photographs on the studio
 * page in the first place.
 */
export const PLAYERS_AT_TABLE: StudioPhoto = {
  src: "/studio-players-at-table.jpg",
  source: "IMG_8679.JPG",
  shows: "Four players around a mahjong table mid-game at the studio",
  alt: "Four players around a mahjong table mid-game at the Las Vegas Mahjong Studio, under a neon Let's Mahjong sign",
  width: 2000,
  height: 1500,
};

export const LUCKY_HARE_DOOR: StudioPhoto = {
  src: "/studio-lucky-hare-door.jpg",
  source: "IMG_8938.JPG",
  // Deliberately not called an entrance photo: it is the venue door with a branded tumbler
  // in front of it, not a photograph of the studio's own entrance.
  shows: "A Las Vegas Mahjong tumbler held up at the Lucky Hare door",
  alt: "A Las Vegas Mahjong tumbler held up at the door of Lucky Hare on West Sahara Avenue",
  width: 1050,
  height: 1400,
};

export const STUDIO_PHOTOS: StudioPhoto[] = [
  WISHBONE_ROOM,
  SEVENS_OPEN_PLAY,
  SHAUNA_AT_TABLE,
  SHAUNA_NEON,
  LESSON_TABLE,
  OPEN_PLAY_SNACKS,
  OPEN_PLAY_PLAYERS,
  OPEN_PLAY_ROOM,
  PLAYERS_AT_TABLE,
  LUCKY_HARE_DOOR,
];
