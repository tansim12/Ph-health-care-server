import { Prisma, PrismaClient } from "@prisma/client";
import { paginationHelper } from "../../helper/paginationHelper";
import { adminSearchAbleFields } from "./Admin.const";

const prisma = new PrismaClient();

const findAllAdminDB = async (queryObj: any, options:any) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;


    const andCondition = []
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: adminSearchAbleFields.map(field => ({
                [field]: {
                    contains: queryObj.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    }
    
    const whereConditions: Prisma.AdminWhereInput = { AND: andCondition }

    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });
    return result;
};

export const adminService = {
  findAllAdminDB,
};
