const people = Array.from({length: 10}, () => ({num: 0}));
for (let i = 0; i < 10; i++)
{
    people[i].num = i;
}

console.log(people[1].num)