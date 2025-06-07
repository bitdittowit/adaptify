'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Filter, RefreshCw, Search, X } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetAllUsers } from '@/hooks/api/entities/users/use-get-all-users';
import type { Role, Sex, User } from '@/types';

type UsersByGroup = { [key: string]: User[] };

type Filters = {
    name: string;
    country: string[];
    level: number[];
    role: string[];
    sex: Sex[];
};

export function UserManagement() {
    const t = useTranslations('admin.users');
    const ct = useTranslations('countries');
    const { data: users, loading, error: apiError } = useGetAllUsers();
    const [usersByGroup, setUsersByGroup] = useState<UsersByGroup>({});
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        name: '',
        country: [],
        level: [],
        role: [],
        sex: [],
    });
    const router = useRouter();
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const [levelRange, setLevelRange] = useState<[number, number]>([1, 10]);

    // Function to get translated country name
    const getCountryName = (countryCode: string): string => {
        if (!countryCode) {
            return String(t('filters.emptyValue'));
        }

        try {
            const key = countryCode.toLowerCase();
            const translated = ct[key as keyof typeof ct];
            return typeof translated === 'string' ? translated : countryCode;
        } catch {
            return countryCode;
        }
    };

    // Force refresh function
    const handleRefresh = () => {
        router.refresh();
    };

    useEffect(() => {
        if (users && Array.isArray(users)) {
            setAllUsers(users);

            // Update level range based on available levels
            const levels = getUniqueLevels();
            if (levels.length > 0) {
                setLevelRange([Math.min(...levels), Math.max(...levels)]);
            }

            applyFilters(users, filters);
        }
    }, [users]);

    useEffect(() => {
        applyFilters(allUsers, filters);
    }, [filters]);

    const applyFilters = (usersToFilter: User[], currentFilters: Filters) => {
        if (!(usersToFilter && Array.isArray(usersToFilter))) {
            return;
        }

        let filtered = [...usersToFilter];

        // Filter by name
        if (currentFilters.name) {
            filtered = filtered.filter(
                user =>
                    user.name.toLowerCase().includes(currentFilters.name.toLowerCase()) ||
                    user.email.toLowerCase().includes(currentFilters.name.toLowerCase()),
            );
        }

        // Filter by country
        if (currentFilters.country.length > 0) {
            filtered = filtered.filter(user => {
                // Handle empty country value in filter
                if (currentFilters.country.includes('') && !user.country) {
                    return true;
                }
                return currentFilters.country.includes(user.country);
            });
        }

        // Filter by level
        if (currentFilters.level.length > 0) {
            filtered = filtered.filter(user => {
                return user.level >= levelRange[0] && user.level <= levelRange[1];
            });
        }

        // Filter by role
        if (currentFilters.role.length > 0) {
            filtered = filtered.filter(user => currentFilters.role.includes(user.role));
        }

        // Filter by sex
        if (currentFilters.sex.length > 0) {
            filtered = filtered.filter(user => currentFilters.sex.includes(user.sex));
        }

        setFilteredUsers(filtered);

        // Group users by study_group
        const grouped = filtered.reduce((acc: UsersByGroup, user: User) => {
            const group = user.study_group || String(t('table.unassigned'));
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(user);
            return acc;
        }, {});

        setUsersByGroup(grouped);
    };

    const resetFilters = () => {
        setFilters({ name: '', country: [], level: [], role: [], sex: [] });

        // Reset level range
        const levels = getUniqueLevels();
        if (levels.length > 0) {
            setLevelRange([Math.min(...levels), Math.max(...levels)]);
        } else {
            setLevelRange([1, 10]);
        }
    };

    // Get unique values for filter options
    const getUniqueCountries = () => {
        // Define a set of supported countries based on translations
        const supportedCountries = ['kz', 'uz', 'kg', 'tj', ''];

        // If there are users, add any countries from the DB not in our predefined list
        if (allUsers && Array.isArray(allUsers)) {
            const countriesFromDB = [...new Set(allUsers.map(user => user.country))];
            // biome-ignore lint/complexity/noForEach: <explanation>
            countriesFromDB.forEach(country => {
                if (!supportedCountries.includes(country) && country) {
                    supportedCountries.push(country);
                }
            });
        }

        return supportedCountries;
    };

    const getUniqueLevels = () => {
        // Define a reasonable range of levels (1-10)
        const supportedLevels = Array.from({ length: 10 }, (_, i) => i + 1);

        // If there are users, add any levels from the DB not in our predefined list
        if (allUsers && Array.isArray(allUsers)) {
            const levelsFromDB = [...new Set(allUsers.map(user => user.level))];
            // biome-ignore lint/complexity/noForEach: <explanation>
            levelsFromDB.forEach(level => {
                if (!supportedLevels.includes(level)) {
                    supportedLevels.push(level);
                }
            });
        }

        return supportedLevels.sort((a, b) => a - b);
    };

    const getUniqueRoles = () => {
        // Define roles based on the Role type
        const supportedRoles: Role[] = ['admin', 'user'];

        // If there are users, add any roles from the DB not in our predefined list
        if (allUsers && Array.isArray(allUsers)) {
            const rolesFromDB = [...new Set(allUsers.map(user => user.role))];
            // biome-ignore lint/complexity/noForEach: <explanation>
            rolesFromDB.forEach(role => {
                if (!supportedRoles.includes(role as Role)) {
                    supportedRoles.push(role as Role);
                }
            });
        }

        return supportedRoles;
    };

    function getInitials(name: string) {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    }

    function getRoleBadgeColor(role: string) {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            default:
                return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
        }
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const toggleFilterValue = (field: keyof Filters, value: any) => {
        setFilters(prev => {
            // Handle array fields
            if (Array.isArray(prev[field])) {
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                const values = prev[field] as any[];
                const exists = values.includes(value);

                if (exists) {
                    return { ...prev, [field]: values.filter(item => item !== value) };
                }
                return { ...prev, [field]: [...values, value] };
            }

            // Handle string field (name)
            if (field === 'name') {
                return { ...prev, name: value };
            }

            return prev;
        });
    };

    // Add function to expand all groups
    const expandAllGroups = () => {
        if (expandedGroups.length === Object.keys(usersByGroup).length) {
            // If all groups are expanded, collapse all
            setExpandedGroups([]);
        } else {
            // Expand all groups
            setExpandedGroups(Object.keys(usersByGroup));
        }
    };

    const handleLevelRangeChange = (values: number[]) => {
        setLevelRange([values[0], values[1]]);
        // Update the filters.level array to include all levels in the range
        const levelsInRange = Array.from({ length: values[1] - values[0] + 1 }, (_, i) => values[0] + i);
        setFilters(prev => ({ ...prev, level: levelsInRange }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-pulse">{String(t('loading'))}</div>
            </div>
        );
    }

    if (apiError) {
        const isAuthError = apiError.message.includes('Unauthorized') || apiError.message.includes('Not authenticated');

        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{String(t('title'))}</CardTitle>
                    <CardDescription>{String(t('error'))}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 border border-red-200 rounded-md bg-red-50 mb-4">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                        <p className="text-red-700">{isAuthError ? String(t('errorPermission')) : apiError.message}</p>
                    </div>
                    <Button onClick={handleRefresh} className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" /> {String(t('tryAgain'))}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (!(users && Array.isArray(users)) || users.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{String(t('title'))}</CardTitle>
                    <CardDescription>{String(t('noUsers'))}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-6 text-center">
                        <p className="text-muted-foreground">{String(t('noUsersDescription'))}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Filter Sidebar for larger screens */}
            <div className="hidden md:block w-64 shrink-0">
                <Card className="sticky top-4">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{String(t('filters.title'))}</CardTitle>
                            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
                                {String(t('filters.reset'))}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-4 py-2">
                        <ScrollArea className="h-[calc(100vh-240px)]">
                            <div className="space-y-6">
                                {/* Search Filter */}
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">{String(t('filters.search'))}</h4>
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder={String(t('filters.searchPlaceholder'))}
                                            value={filters.name}
                                            onChange={e => toggleFilterValue('name', e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                </div>

                                <Separator />

                                {/* Gender Filter (Sex) - Binary choice so use checkboxes */}
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">{String(t('filters.gender'))}</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="male"
                                                checked={filters.sex.includes('male')}
                                                onCheckedChange={checked => {
                                                    if (checked) {
                                                        toggleFilterValue('sex', 'male');
                                                    } else {
                                                        toggleFilterValue('sex', 'male');
                                                    }
                                                }}
                                            />
                                            <label htmlFor="male" className="text-sm cursor-pointer">
                                                {String(t('filters.genderMale'))}
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="female"
                                                checked={filters.sex.includes('female')}
                                                onCheckedChange={checked => {
                                                    if (checked) {
                                                        toggleFilterValue('sex', 'female');
                                                    } else {
                                                        toggleFilterValue('sex', 'female');
                                                    }
                                                }}
                                            />
                                            <label htmlFor="female" className="text-sm cursor-pointer">
                                                {String(t('filters.genderFemale'))}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Country Filter - Multiple selection, use checkboxes */}
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">{String(t('filters.country'))}</h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {getUniqueCountries().map(country => (
                                            <div key={country || 'empty'} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`country-${country || 'empty'}`}
                                                    checked={filters.country.includes(country)}
                                                    onCheckedChange={checked => {
                                                        if (checked) {
                                                            toggleFilterValue('country', country);
                                                        } else {
                                                            toggleFilterValue('country', country);
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`country-${country || 'empty'}`}
                                                    className="text-sm cursor-pointer"
                                                >
                                                    {getCountryName(country)}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Level Filter - Using slider */}
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">{String(t('filters.level'))}</h4>
                                    <div className="space-y-4">
                                        <div className="text-sm text-center mb-2">
                                            {String(
                                                t('filters.levelRange', {
                                                    min: levelRange[0],
                                                    max: levelRange[1],
                                                }),
                                            )}
                                        </div>
                                        <Slider
                                            defaultValue={[1, 10]}
                                            value={levelRange}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onValueChange={handleLevelRangeChange}
                                            minStepsBetweenThumbs={1}
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>1</span>
                                            <span>10</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Role Filter */}
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">{String(t('filters.role'))}</h4>
                                    <div className="space-y-2">
                                        {getUniqueRoles().map(role => (
                                            <div key={role} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`role-${role}`}
                                                    checked={filters.role.includes(role)}
                                                    onCheckedChange={checked => {
                                                        if (checked) {
                                                            toggleFilterValue('role', role);
                                                        } else {
                                                            toggleFilterValue('role', role);
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={`role-${role}`} className="text-sm cursor-pointer">
                                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-4">
                <Button
                    onClick={() => setFilterOpen(!filterOpen)}
                    variant="outline"
                    className="w-full flex items-center justify-between"
                >
                    <span className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        {String(t('filters.title'))}
                    </span>
                    <Badge variant="secondary">
                        {
                            Object.values(filters)
                                .flat()
                                .filter(v => v !== '' && v !== undefined).length
                        }
                    </Badge>
                </Button>

                {filterOpen && (
                    <Card className="mt-2">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">{String(t('filters.title'))}</CardTitle>
                                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
                                    {String(t('filters.reset'))}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 py-2">
                            <div className="space-y-4">
                                {/* Search Filter */}
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">{String(t('filters.search'))}</h4>
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder={String(t('filters.searchPlaceholder'))}
                                            value={filters.name}
                                            onChange={e => toggleFilterValue('name', e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                </div>

                                {/* Gender Filter */}
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">{String(t('filters.gender'))}</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="mobile-male"
                                                checked={filters.sex.includes('male')}
                                                onCheckedChange={checked => {
                                                    if (checked) {
                                                        toggleFilterValue('sex', 'male');
                                                    } else {
                                                        toggleFilterValue('sex', 'male');
                                                    }
                                                }}
                                            />
                                            <label htmlFor="mobile-male" className="text-sm cursor-pointer">
                                                {String(t('filters.genderMale'))}
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="mobile-female"
                                                checked={filters.sex.includes('female')}
                                                onCheckedChange={checked => {
                                                    if (checked) {
                                                        toggleFilterValue('sex', 'female');
                                                    } else {
                                                        toggleFilterValue('sex', 'female');
                                                    }
                                                }}
                                            />
                                            <label htmlFor="mobile-female" className="text-sm cursor-pointer">
                                                {String(t('filters.genderFemale'))}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Country Filter - Multiple selection, use select */}
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">{String(t('filters.country'))}</h4>
                                    <Select onValueChange={value => toggleFilterValue('country', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={String(t('filters.selectCountry'))} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getUniqueCountries().map(country => (
                                                <SelectItem key={country || 'empty'} value={country}>
                                                    {getCountryName(country)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {filters.country.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {filters.country.map(country => (
                                                <Badge
                                                    key={country || 'empty'}
                                                    variant="secondary"
                                                    className="flex items-center gap-1"
                                                >
                                                    {getCountryName(country)}
                                                    <X
                                                        className="h-3 w-3 cursor-pointer"
                                                        onClick={() => toggleFilterValue('country', country)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Level Filter for mobile */}
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">{String(t('filters.level'))}</h4>
                                    <div className="space-y-4">
                                        <div className="text-sm text-center mb-2">
                                            {String(
                                                t('filters.levelRange', {
                                                    min: levelRange[0],
                                                    max: levelRange[1],
                                                }),
                                            )}
                                        </div>
                                        <Slider
                                            defaultValue={[1, 10]}
                                            value={levelRange}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onValueChange={handleLevelRangeChange}
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>1</span>
                                            <span>10</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Button onClick={() => setFilterOpen(false)} className="w-full">
                                    {String(t('filters.apply'))}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Main Content */}
            <Card className="flex-1">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>{String(t('title'))}</CardTitle>
                            <CardDescription>
                                {filteredUsers.length === allUsers.length
                                    ? String(
                                          t('description', {
                                              count: filteredUsers.length,
                                              groupCount: Object.keys(usersByGroup).length,
                                          }),
                                      )
                                    : String(
                                          t('filteredDescription', {
                                              count: filteredUsers.length,
                                              total: allUsers.length,
                                          }),
                                      )}
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={expandAllGroups}>
                            {expandedGroups.length === Object.keys(usersByGroup).length
                                ? String(t('collapseAll'))
                                : String(t('expandAll'))}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Accordion
                        type="multiple"
                        className="w-full"
                        value={expandedGroups}
                        onValueChange={setExpandedGroups}
                    >
                        {Object.entries(usersByGroup).map(([group, groupUsers]) => (
                            <AccordionItem key={group} value={group}>
                                <AccordionTrigger className="px-4">
                                    <div className="flex justify-between w-full pr-4">
                                        <span>{group}</span>
                                        <Badge variant="outline" className="ml-2">
                                            {groupUsers.length} users
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-2">
                                    <div className="rounded border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12" />
                                                    <TableHead>{String(t('table.name'))}</TableHead>
                                                    <TableHead>{String(t('table.email'))}</TableHead>
                                                    <TableHead>{String(t('table.country'))}</TableHead>
                                                    <TableHead>{String(t('table.level'))}</TableHead>
                                                    <TableHead>{String(t('table.role'))}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {groupUsers.map(user => (
                                                    <TableRow
                                                        key={user.id}
                                                        className="cursor-pointer hover:bg-muted/50"
                                                        onClick={() => router.push(`/admin/users/${user.id}`)}
                                                    >
                                                        <TableCell>
                                                            <Avatar>
                                                                <AvatarImage src={user.image || ''} alt={user.name} />
                                                                <AvatarFallback>
                                                                    {getInitials(user.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        </TableCell>
                                                        <TableCell className="font-medium">{user.name}</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>{getCountryName(user.country)}</TableCell>
                                                        <TableCell>{user.level}</TableCell>
                                                        <TableCell>
                                                            <Badge className={getRoleBadgeColor(user.role)}>
                                                                {user.role}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
