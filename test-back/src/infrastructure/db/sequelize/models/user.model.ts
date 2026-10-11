import {
	DataTypes,
	Model,
	Optional,
	InferAttributes,
	CreationOptional
} from "sequelize";
import sequelize from "../config/database";

// 1. Usamos InferAttributes para que TS lea los tipos directamente de UserModel.init
export interface UserAttributes extends InferAttributes<UserModel> {
	id: CreationOptional<string>; // CreationOptional le dice a TS que la BD lo genera
	name: string;
	email: string;
	createdAt: CreationOptional<Date>;
	updatedAt: CreationOptional<Date>;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> { }

export class UserModel
	extends Model<UserAttributes, UserCreationAttributes>
	implements UserAttributes {
	// 2. 'declare' reemplaza a 'public' + '!'. Es la forma correcta y segura en TS.
	declare id: CreationOptional<string>;
	declare name: string;
	declare email: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

UserModel.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		tableName: "users",
		timestamps: true,
	}
);