const assert = require("assert");

const {emptyValueForShape, traverseShape, shapes} =
    require("../multirenderer.jsx");

function item(n) {
    return {
        content: `item ${n}`,
        images: {},
        widgets: {},
    };
}

describe("traverseShape", () => {
    const shape = shapes.shape({
        a: shapes.item,
        b: shapes.arrayOf(shapes.item),
        c: shapes.shape({
            d: shapes.item,
            e: shapes.item,
        }),
    });

    const data = {
        a: item(1),
        b: [item(2), item(3), item(4)],
        c: {
            d: item(5),
            e: item(6),
        },
    };

    it("correctly calls callback for each of the leaf nodes", () => {
        const calledWith = [];
        traverseShape(shape, data, e => calledWith.push(e));
        calledWith.sort();

        assert.deepEqual(
            [item(1), item(2), item(3), item(4), item(5), item(6)],
            calledWith);
    });

    it("returns a data result with the correct shape", () => {
        const result = traverseShape(shape, data, e => e.content);

        assert.deepEqual({
            a: "item 1",
            b: ["item 2", "item 3", "item 4"],
            c: {
                d: "item 5",
                e: "item 6",
            },
        }, result);
    });

    it("calls the callback with the correct paths to the items", () => {
        // Return the path of the item in place of each of the items.
        const result = traverseShape(shape, data, (_, path) => path);

        assert.deepEqual({
            a: ["a"],
            b: [["b", 0], ["b", 1], ["b", 2]],
            c: {
                d: ["c", "d"],
                e: ["c", "e"],
            },
        }, result);
    });

    it("handles recursive objects", () => {
        const shape = shapes.shape({
            a: shapes.shape({
                b: shapes.shape({
                    c: shapes.item,
                }),
            }),
        });

        const data = {a: {b: {c: item(1)}}};

        const result = traverseShape(shape, data, e => e.content);

        assert.deepEqual({a: {b: {c: "item 1"}}}, result);
    });

    it("handles recursive arrays", () => {
        const shape = shapes.arrayOf(
            shapes.arrayOf(shapes.arrayOf(shapes.item)));

        const data = [[[item(0)], [item(1)]], [[item(2)], [item(3), item(4)]]];

        const result = traverseShape(shape, data, e => e.content);

        assert.deepEqual(
            [[["item 0"], ["item 1"]], [["item 2"], ["item 3", "item 4"]]],
            result);
    });

    it("handles empty arrays", () => {
        const shape = shapes.arrayOf(shapes.arrayOf(shapes.item));

        assert.deepEqual([], traverseShape(shape, [], () => {}));

        const result =
            traverseShape(shape, [[], [item(1)], []], e => e.content);
        assert.deepEqual([[], ["item 1"], []], result);
    });

    it("calls the collection callback for arrays", () => {
        const shape = shapes.arrayOf(shapes.item);
        const data = [item(1), item(2), item(3)];

        traverseShape(shape, data, e => e.content, (data2, shape2, path) => {
            assert.deepEqual(["item 1", "item 2", "item 3"], data2);
            assert.deepEqual(shape, shape2);
            assert.deepEqual([], path);
        });
    });

    it("calls the collection callback for objects", () => {
        const shape = shapes.shape({
            a: shapes.item,
            b: shapes.item,
        });
        const data = {
            a: item(1),
            b: item(2),
        };

        traverseShape(shape, data, e => e.content, (data2, shape2, path) => {
            assert.deepEqual({
                a: "item 1",
                b: "item 2",
            }, data2);
            assert.deepEqual(shape, shape2);
            assert.deepEqual([], path);
        });
    });

    it("builds the structure from the collection callback return value", () => {
        const shape = shapes.shape({
            a: shapes.item,
            b: shapes.arrayOf(shapes.item),
            c: shapes.shape({
                d: shapes.item,
                e: shapes.item,
            }),
        });

        const data = {
            a: item(1),
            b: [item(2), item(3), item(4)],
            c: {
                d: item(5),
                e: item(6),
            },
        };

        function collectionCallback(dat, shp, path) {
            if (path.length === 0) {
                dat.top = true;
                return dat;
            }

            if (shp.type === "object") {
                return Object.keys(dat).concat(
                    Object.keys(dat).map(k => dat[k]));
            } else if (shp.type === "array") {
                return dat.map(c => c + " in array");
            }
        }

        const result = traverseShape(shape, data, e => e.content,
                                     collectionCallback);

        assert.deepEqual({
            top: true,
            a: "item 1",
            b: ["item 2 in array", "item 3 in array", "item 4 in array"],
            c: ["d", "e", "item 5", "item 6"],
        }, result);
    });
});

describe("emptyValueForShape", () => {
    const expectedEmptyItemValue = {
        "content": "",
        "images": {},
        "widgets": {},
    };

    it("creates an empty item", () => {
        assert.deepEqual(expectedEmptyItemValue, emptyValueForShape(
            shapes.item
        ));
    });

    it("creates an empty array of items", () => {
        assert.deepEqual([], emptyValueForShape(
            shapes.arrayOf(shapes.item)
        ));
    });

    it("creates an empty array of objects", () => {
        assert.deepEqual([], emptyValueForShape(
            shapes.arrayOf(
                shapes.shape({
                    left: shapes.item,
                    right: shapes.item,
                })
            )
        ));
    });

    it("creates an empty array of arrays", () => {
        assert.deepEqual([], emptyValueForShape(
            shapes.arrayOf(
                shapes.arrayOf(
                    shapes.item
                )
            )
        ));
    });

    it("creates an empty object of all other cases", () => {
        const expectedEmptyObjectValue = {
            context: {
                intro: expectedEmptyItemValue,
                prompt: expectedEmptyItemValue,
            },
            footnotes: [],
            questions: [],
            weirdItemMatrix: [],
        };
        assert.deepEqual(expectedEmptyObjectValue, emptyValueForShape(
            shapes.shape({
                context: shapes.shape({
                    intro: shapes.item,
                    prompt: shapes.item,
                }),
                footnotes: shapes.arrayOf(shapes.item),
                questions: shapes.arrayOf(shapes.shape({
                    question: shapes.item,
                    answerArea: shapes.item,
                })),
                weirdItemMatrix: shapes.arrayOf(shapes.arrayOf(shapes.item)),
            })
        ));
    });
});
