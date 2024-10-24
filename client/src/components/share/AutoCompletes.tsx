import {forwardRef, useEffect, useRef, useState} from "react";
import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    FloatingPortal,
    size,
    useDismiss,
    useFloating,
    useId,
    useInteractions,
    useListNavigation,
    useRole,
    useTransitionStyles
} from "@floating-ui/react";
import {Input} from "@/components/ui/input";
import {cn} from "@/utils/styles";
import {ScrollArea} from "@/components/ui/scroll-area";

interface ItemProps {
    children: React.ReactNode;
    active: boolean;
}

const Item = forwardRef<
    HTMLDivElement,
    ItemProps & React.HTMLProps<HTMLDivElement>
>(({children, active, ...rest}, ref) => {
    const id = useId();
    return (
        <div
            ref={ref}
            role="option"
            id={id}
            aria-selected={active}
            {...rest}
            style={{...rest.style}}
            className={cn({'bg-secondary cursor-pointer text-[0.875rem]': active}, 'p-[4px] rounded-md text-md')}
        >
            {children}
        </div>
    );
});

export function AutoComplete({data, inputValue, setInputValue}: { data: any, setInputValue: any, inputValue: any }) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const listRef = useRef<Array<HTMLElement | null>>([]);

    const {refs, floatingStyles, context} = useFloating<HTMLInputElement>({
        whileElementsMounted: autoUpdate,
        open,
        onOpenChange: setOpen,
        middleware: [
            flip({padding: 10}),
            size({
                apply({rects, availableHeight, elements}) {
                    Object.assign(elements.floating.style, {
                        width: `${rects.reference.width}px`,
                        maxHeight: `${availableHeight}px`
                    });
                },
                padding: 10
            })
        ]
    });

    const role = useRole(context, {role: "listbox"});
    const dismiss = useDismiss(context);
    const listNav = useListNavigation(context, {
        listRef,
        activeIndex,
        onNavigate: setActiveIndex,
        virtual: true,
        loop: true
    });

    const {
        getReferenceProps,
        getFloatingProps,
        getItemProps
    } = useInteractions([role, dismiss, listNav]);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setInputValue(value);

        if (value) {
            setOpen(true);
            setActiveIndex(0);
        } else {
            setOpen(false);
        }
    }

    const items = data.filter((item: any) =>
        item.label.toLowerCase().startsWith(inputValue.toLowerCase()) || item.value.toLowerCase().startsWith(inputValue.toLowerCase())
    );


    const {isMounted, styles} = useTransitionStyles(context, {
        common: ({side}) => ({
            transformOrigin: {
                top: 'bottom',
                bottom: 'top',
                left: 'right',
                right: 'left',
            }[side],
        }),
    });

    useEffect(() => {
        if (items.length === 0) setOpen(false)
    }, [items]);

    return (
        <>
            <Input
                {...getReferenceProps({
                    ref: refs.setReference,
                    onChange,
                    value: inputValue,
                    onFocus: () => {
                        setOpen(true)
                    },
                    onClick: () => {
                        setOpen(true)
                    },
                    placeholder: "Wallet Address",
                    "aria-autocomplete": "list",
                    onKeyDown(event) {
                        if (
                            event.key === "Enter" &&
                            activeIndex != null &&
                            items[activeIndex]
                        ) {
                            setInputValue(items[activeIndex].value);
                            setActiveIndex(null);
                            setOpen(false);
                        }
                    }
                })}
            />
            <FloatingPortal>
                {open && isMounted && (
                    <FloatingFocusManager
                        context={context}
                        initialFocus={-1}
                        visuallyHiddenDismiss
                    >
                        <ScrollArea
                            {...getFloatingProps({
                                ref: refs.setFloating,
                                className: 'bg-popover shadow-md rounded-md text-black mt-1 border-border border-2 p-1 text-popover-foreground',
                                style: {
                                    ...floatingStyles,
                                    ...styles
                                }
                            })}
                        >
                            {items.map((item: any, index: any) => (
                                <Item
                                    {...getItemProps({
                                        key: item.value,
                                        ref(node) {
                                            listRef.current[index] = node;
                                        },
                                        onClick() {
                                            setInputValue(item.value);
                                            refs.domReference.current?.focus();
                                            setOpen(false);
                                        },
                                        className: ' cursor-pointer text-sm'
                                    })}
                                    active={activeIndex === index}
                                >
                                    {item.label}
                                </Item>
                            ))}
                        </ScrollArea>
                    </FloatingFocusManager>
                )}
            </FloatingPortal>
        </>
    );
}
