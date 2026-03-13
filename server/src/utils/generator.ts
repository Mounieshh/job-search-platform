import { uniqueNamesGenerator, colors, animals, type Config } from "unique-names-generator";
import { AvatarGenerator } from "random-avatar-generator";

const generator = new AvatarGenerator()

const nameConfig: Config = {
    dictionaries: [colors, animals],
    separator: "",
    style: "capital"
}

export function generateName(): string {
    return uniqueNamesGenerator(nameConfig)
}

export function generateAvatar(seed: string): string {
    return generator.generateRandomAvatar(seed)
}